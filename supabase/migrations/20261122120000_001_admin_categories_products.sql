-- 001: admin helper, category visibility, products status, admin RLS
begin;

do $$
begin
  if exists (select 1 from public.products
             where status is null or status not in ('draft','published','hidden')) then
    raise exception 'Pre-flight failed: products.status has NULL or unexpected values';
  end if;
  if exists (select 1 from public.categories
             where name_fr is null or btrim(name_fr) = '') then
    raise exception 'Pre-flight failed: category with blank name_fr';
  end if;
end $$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.admin_access a where a.user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = ''
as $$ begin new.updated_at := now(); return new; end $$;
revoke all on function public.set_updated_at() from public, anon, authenticated;

alter table public.admin_access enable row level security;
revoke all on public.admin_access from anon, authenticated;
grant select on public.admin_access to authenticated;
drop policy if exists "admin_access read own row" on public.admin_access;
create policy "admin_access read own row" on public.admin_access
  for select to authenticated using (user_id = (select auth.uid()));

alter table public.categories
  add column if not exists is_active     boolean     not null default true,
  add column if not exists show_on_home  boolean     not null default true,
  add column if not exists image_path    text,
  add column if not exists updated_at    timestamptz not null default now();
alter table public.categories drop constraint if exists categories_name_fr_not_blank;
alter table public.categories add constraint categories_name_fr_not_blank check (btrim(name_fr) <> '');
drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at before update on public.categories
  for each row execute function public.set_updated_at();

alter table public.products add column if not exists is_featured boolean not null default false;
alter table public.products alter column status set default 'draft';
alter table public.products alter column status set not null;
alter table public.products drop constraint if exists products_status_check;
alter table public.products add constraint products_status_check
  check (status in ('draft','published','hidden'));

alter table public.categories enable row level security;
alter table public.products   enable row level security;
revoke all on public.categories, public.products from anon, authenticated;
grant select on public.categories, public.products to anon, authenticated;
grant insert, update         on public.categories to authenticated;
grant insert, update, delete on public.products   to authenticated;

drop policy if exists "public read categories"        on public.categories;
drop policy if exists "public read active categories" on public.categories;
drop policy if exists "admin manage categories"       on public.categories;
create policy "public read active categories" on public.categories
  for select to anon, authenticated using (is_active);
create policy "admin manage categories" on public.categories
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "public read published products"                      on public.products;
drop policy if exists "public read published products in active categories" on public.products;
drop policy if exists "admin manage products"                               on public.products;
create policy "public read published products in active categories" on public.products
  for select to anon, authenticated
  using (status = 'published'
         and (category_id is null
              or exists (select 1 from public.categories c
                         where c.id = category_id and c.is_active)));
create policy "admin manage products" on public.products
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

commit;