-- 002: product-images bucket (public by exact URL, 5 MB, images only).
-- Storage policies are in 002b2. Idempotent.
begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880,
        array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = true,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg','image/png','image/webp'];

do $$
begin
  if not exists (select 1 from storage.buckets
                 where id = 'product-images' and public
                   and file_size_limit = 5242880
                   and allowed_mime_types = array['image/jpeg','image/png','image/webp']) then
    raise exception 'bucket product-images is not configured as approved';
  end if;
end $$;

commit;