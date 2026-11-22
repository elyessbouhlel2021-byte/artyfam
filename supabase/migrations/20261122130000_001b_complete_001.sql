-- 001b: completes 001 (idempotent). Adds assertions on the final state.
begin;

do $$
begin
  if exists (select 1 from public.products
             where status is null or status not in ('draft','published','hidden')) then
    raise exception 'Pre-flight failed: products.status has NULL or unexpected values';
  end if;
end $$;

drop policy if exists "admin_access read own row" on public.admin_access;
create policy "admin_access read own row" on public.admin_access
  for select to authenticated using (user_id = (select auth.uid()));

alter table public.products alter column status set default 'draft';
alter table public.products alter column status set not null;
alter table public.products drop constraint if exists products_status_check;
alter table public.products add constraint products_status_check
  check (status in ('draft','published','hidden'));

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

do $$
begin
  if (select count(*) from pg_policies
      where schemaname='public' and tablename in ('admin_access','categories','products')) <> 5 then
    raise exception 'Expected exactly 5 policies on admin_access/categories/products';
  end if;
  if exists (select 1 from information_schema.role_table_grants
             where table_schema='public' and grantee='anon'
               and ((table_name='admin_access')
                 or (table_name in ('categories','products') and privilege_type <> 'SELECT'))) then
    raise exception 'anon has grants beyond SELECT on categories/products, or any on admin_access';
  end if;
  if exists (select 1 from information_schema.role_table_grants
             where table_schema='public' and grantee='authenticated'
               and ((table_name='admin_access' and privilege_type <> 'SELECT')
                 or (table_name='categories'   and privilege_type = 'DELETE'))) then
    raise exception 'authenticated has forbidden grants (admin_access writes or categories DELETE)';
  end if;
end $$;

commit;