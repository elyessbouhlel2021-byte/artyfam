-- 002b1: admin category RPCs. Each starts with is_admin() (auth.uid() vs admin_access).
begin;

create or replace function public.admin_reorder_categories(p_ids uuid[])
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if p_ids is null or cardinality(p_ids) = 0 then
    raise exception 'empty id list' using errcode = '22023';
  end if;
  if (select count(distinct x) from unnest(p_ids) x) <> cardinality(p_ids) then
    raise exception 'duplicate ids' using errcode = '22023';
  end if;
  if (select count(*) from public.categories) <> cardinality(p_ids)
     or exists (select 1 from unnest(p_ids) x
                where not exists (select 1 from public.categories c where c.id = x)) then
    raise exception 'id list must contain every category exactly once' using errcode = '22023';
  end if;

  update public.categories c
     set sort_order = o.ord
    from unnest(p_ids) with ordinality as o(id, ord)
   where c.id = o.id;
end $$;

create or replace function public.admin_reassign_category(p_from uuid, p_to uuid)
returns integer
language plpgsql security definer set search_path = ''
as $$
declare n integer;
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if p_from is null or p_to is null or p_from = p_to then
    raise exception 'invalid category pair' using errcode = '22023';
  end if;
  if not exists (select 1 from public.categories where id = p_from)
     or not exists (select 1 from public.categories where id = p_to) then
    raise exception 'category not found' using errcode = 'P0002';
  end if;

  update public.products set category_id = p_to, updated_at = now()
   where category_id = p_from;
  get diagnostics n = row_count;
  return n;
end $$;

create or replace function public.admin_delete_category(p_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if not exists (select 1 from public.categories where id = p_id) then
    raise exception 'category not found' using errcode = 'P0002';
  end if;
  if exists (select 1 from public.products where category_id = p_id) then
    raise exception 'category_in_use' using errcode = '23503';
  end if;
  delete from public.categories where id = p_id;
end $$;

revoke all on function public.admin_reorder_categories(uuid[])    from public, anon;
revoke all on function public.admin_reassign_category(uuid, uuid) from public, anon;
revoke all on function public.admin_delete_category(uuid)         from public, anon;
grant execute on function public.admin_reorder_categories(uuid[])    to authenticated;
grant execute on function public.admin_reassign_category(uuid, uuid) to authenticated;
grant execute on function public.admin_delete_category(uuid)         to authenticated;

do $$
begin
  if has_function_privilege('anon', 'public.admin_reorder_categories(uuid[])', 'execute')
     or has_function_privilege('anon', 'public.admin_reassign_category(uuid,uuid)', 'execute')
     or has_function_privilege('anon', 'public.admin_delete_category(uuid)', 'execute') then
    raise exception 'anon can execute an admin RPC';
  end if;
  if not (has_function_privilege('authenticated', 'public.admin_reorder_categories(uuid[])', 'execute')
      and has_function_privilege('authenticated', 'public.admin_reassign_category(uuid,uuid)', 'execute')
      and has_function_privilege('authenticated', 'public.admin_delete_category(uuid)', 'execute')) then
    raise exception 'authenticated cannot execute an admin RPC';
  end if;
end $$;

commit;