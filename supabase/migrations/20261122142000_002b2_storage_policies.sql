-- 002b2: Storage policies for product-images. Admin only; no anon policy, so no public listing.
begin;

drop policy if exists "product-images admin read"   on storage.objects;
drop policy if exists "product-images admin insert" on storage.objects;
drop policy if exists "product-images admin update" on storage.objects;
drop policy if exists "product-images admin delete" on storage.objects;

create policy "product-images admin read" on storage.objects
  for select to authenticated
  using (bucket_id = 'product-images' and (select public.is_admin()));

create policy "product-images admin insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'product-images'
    and (select public.is_admin())
    and name ~ '^(products|categories)/[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|jpeg|png|webp)$'
  );

create policy "product-images admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and (select public.is_admin()))
  with check (
    bucket_id = 'product-images'
    and (select public.is_admin())
    and name ~ '^(products|categories)/[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|jpeg|png|webp)$'
  );

create policy "product-images admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and (select public.is_admin()));

do $$
begin
  if (select count(*) from pg_policies
      where schemaname = 'storage' and tablename = 'objects'
        and policyname like 'product-images admin %') <> 4 then
    raise exception 'expected exactly 4 product-images policies';
  end if;
  if exists (select 1 from pg_policies
             where schemaname = 'storage' and tablename = 'objects'
               and 'anon' = any (roles)) then
    raise exception 'an anon-accessible policy exists on storage.objects';
  end if;
end $$;

commit;