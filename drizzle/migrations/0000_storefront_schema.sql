create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name jsonb not null,
  image text,
  popular boolean not null default false,
  position int not null default 0,
  status text not null default 'published' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_id uuid not null references public.categories(id),
  name jsonb not null,
  description jsonb not null default '{}'::jsonb,
  promo_label jsonb,
  status text not null default 'published' check (status in ('draft','published','archived')),
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.product_options (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  key text not null,
  name jsonb not null,
  position int not null default 0,
  unique (product_id, key)
);

create table public.product_option_values (
  id uuid primary key default gen_random_uuid(),
  option_id uuid not null references public.product_options(id) on delete cascade,
  key text not null,
  name jsonb not null,
  hex text,
  position int not null default 0,
  unique (option_id, key)
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text unique,
  option_value_ids uuid[] not null default '{}',
  price_tnd numeric(12,3) not null,
  price_eur numeric(12,2) not null,
  sale_price_tnd numeric(12,3),
  sale_price_eur numeric(12,2),
  stock int not null default 0 check (stock >= 0),
  active boolean not null default true,
  image text,
  created_at timestamptz not null default now()
);
create index product_variants_product_idx on public.product_variants(product_id);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  url text not null,
  alt jsonb,
  position int not null default 0
);

create table public.coupons (
  code text primary key,
  kind text not null check (kind in ('percent','fixed')),
  value numeric(12,3) not null check (value > 0),
  currency text check (currency in ('TND','EUR')),
  min_subtotal numeric(12,3),
  starts_at timestamptz,
  expires_at timestamptz,
  usage_limit int,
  used_count int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.shipping_methods (
  id uuid primary key default gen_random_uuid(),
  market text not null check (market in ('TN','IT')),
  name jsonb not null,
  fee numeric(12,3) not null default 0,
  free_over numeric(12,3),
  active boolean not null default true,
  position int not null default 0
);

create table public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  market text not null check (market in ('TN','IT')),
  key text not null,
  name jsonb not null,
  description jsonb,
  active boolean not null default true,
  position int not null default 0,
  unique (market, key)
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  created_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  label text,
  first_name text,
  last_name text,
  country text not null,
  region text,
  address text not null,
  phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.wishlists (
  user_id uuid not null,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  qty int not null check (qty > 0 and qty <= 99),
  created_at timestamptz not null default now(),
  unique (cart_id, variant_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  user_id uuid,
  email text,
  phone text,
  market text not null,
  currency text not null,
  status text not null default 'pending' check (status in ('pending','confirmed','shipped','delivered','cancelled')),
  subtotal numeric(12,3) not null,
  discount numeric(12,3) not null default 0,
  shipping_fee numeric(12,3) not null default 0,
  total numeric(12,3) not null,
  coupon_code text,
  shipping jsonb not null,
  payment_method text not null,
  idempotency_key text unique,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  variant_id uuid,
  product_name jsonb not null,
  variant_label jsonb,
  sku text,
  unit_price numeric(12,3) not null,
  qty int not null,
  line_total numeric(12,3) not null
);

grant select on public.categories, public.products, public.product_options, public.product_option_values, public.product_variants, public.product_images to anon, authenticated;
grant select on public.shipping_methods, public.payment_methods to anon, authenticated;
grant select, insert, update, delete on public.profiles, public.addresses, public.wishlists, public.carts, public.cart_items to authenticated;
grant select on public.orders, public.order_items to authenticated;
grant all on public.categories, public.products, public.product_options, public.product_option_values, public.product_variants, public.product_images, public.coupons, public.shipping_methods, public.payment_methods, public.profiles, public.addresses, public.wishlists, public.carts, public.cart_items, public.orders, public.order_items to service_role;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_options enable row level security;
alter table public.product_option_values enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.coupons enable row level security;
alter table public.shipping_methods enable row level security;
alter table public.payment_methods enable row level security;
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.wishlists enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "public read published categories" on public.categories for select to anon, authenticated using (status = 'published');
create policy "public read published products" on public.products for select to anon, authenticated using (status = 'published');
create policy "public read options" on public.product_options for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.status = 'published'));
create policy "public read option values" on public.product_option_values for select to anon, authenticated
  using (exists (select 1 from public.product_options o join public.products p on p.id = o.product_id where o.id = option_id and p.status = 'published'));
create policy "public read active variants" on public.product_variants for select to anon, authenticated
  using (active and exists (select 1 from public.products p where p.id = product_id and p.status = 'published'));
create policy "public read images" on public.product_images for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.status = 'published'));
create policy "public read shipping" on public.shipping_methods for select to anon, authenticated using (active);
create policy "public read payment" on public.payment_methods for select to anon, authenticated using (active);

create policy "read own profile" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "own addresses" on public.addresses for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own wishlist" on public.wishlists for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own cart" on public.carts for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own cart items" on public.cart_items for all to authenticated
  using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()))
  with check (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()));

create policy "read own orders" on public.orders for select to authenticated using (auth.uid() = user_id);
create policy "read own order items" on public.order_items for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name')
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.validate_coupon(_code text, _market text, _subtotal numeric)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  c public.coupons%rowtype;
  v_currency text;
  v_discount numeric;
begin
  v_currency := case _market when 'TN' then 'TND' when 'IT' then 'EUR' end;
  if v_currency is null then return jsonb_build_object('valid', false, 'reason', 'invalid'); end if;
  select * into c from public.coupons where code = upper(trim(_code));
  if not found or not c.active then return jsonb_build_object('valid', false, 'reason', 'invalid'); end if;
  if c.starts_at is not null and c.starts_at > now() then return jsonb_build_object('valid', false, 'reason', 'not_started'); end if;
  if c.expires_at is not null and c.expires_at < now() then return jsonb_build_object('valid', false, 'reason', 'expired'); end if;
  if c.usage_limit is not null and c.used_count >= c.usage_limit then return jsonb_build_object('valid', false, 'reason', 'usage_limit'); end if;
  if c.min_subtotal is not null and _subtotal < c.min_subtotal then
    return jsonb_build_object('valid', false, 'reason', 'min_subtotal', 'min_subtotal', c.min_subtotal);
  end if;
  if c.kind = 'percent' then
    v_discount := round(_subtotal * c.value / 100, case when v_currency = 'TND' then 3 else 2 end);
  else
    if c.currency is not null and c.currency <> v_currency then
      return jsonb_build_object('valid', false, 'reason', 'wrong_currency');
    end if;
    v_discount := least(c.value, _subtotal);
  end if;
  return jsonb_build_object('valid', true, 'code', c.code, 'kind', c.kind, 'value', c.value, 'discount', v_discount);
end $$;

create or replace function public.place_order(payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_market text := payload->>'market';
  v_currency text;
  v_dec int;
  v_idem text := nullif(payload->>'idempotency_key','');
  v_existing public.orders%rowtype;
  v_order_id uuid;
  v_ref text;
  v_item jsonb;
  v_variant public.product_variants%rowtype;
  v_product public.products%rowtype;
  v_qty int;
  v_unit numeric;
  v_line numeric;
  v_subtotal numeric := 0;
  v_discount numeric := 0;
  v_shipping_fee numeric := 0;
  v_total numeric;
  v_ship public.shipping_methods%rowtype;
  v_pay public.payment_methods%rowtype;
  v_coupon jsonb;
  v_code text := nullif(payload->>'coupon_code','');
  v_labels jsonb;
begin
  if v_idem is not null then
    select * into v_existing from public.orders where idempotency_key = v_idem;
    if found then
      return jsonb_build_object('reference', v_existing.reference, 'total', v_existing.total,
        'currency', v_existing.currency, 'subtotal', v_existing.subtotal, 'discount', v_existing.discount,
        'shipping_fee', v_existing.shipping_fee, 'duplicate', true);
    end if;
  end if;

  v_currency := case v_market when 'TN' then 'TND' when 'IT' then 'EUR' end;
  if v_currency is null then raise exception 'invalid_market'; end if;
  v_dec := case when v_currency = 'TND' then 3 else 2 end;

  if payload->'items' is null or jsonb_typeof(payload->'items') <> 'array' or jsonb_array_length(payload->'items') = 0 then
    raise exception 'empty_cart';
  end if;

  select * into v_ship from public.shipping_methods
    where id = (payload->>'shipping_method_id')::uuid and market = v_market and active;
  if not found then raise exception 'invalid_shipping_method'; end if;

  select * into v_pay from public.payment_methods
    where key = payload->>'payment_method' and market = v_market and active;
  if not found then raise exception 'invalid_payment_method'; end if;

  v_ref := 'AF-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
  insert into public.orders (reference, user_id, email, phone, market, currency, subtotal, discount, shipping_fee, total, coupon_code, shipping, payment_method, idempotency_key)
  values (v_ref, nullif(payload->>'user_id','')::uuid, payload->>'email', payload->>'phone', v_market, v_currency, 0, 0, 0, 0, v_code, payload->'shipping', payload->>'payment_method', v_idem)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(payload->'items') loop
    v_qty := (v_item->>'qty')::int;
    if v_qty is null or v_qty < 1 or v_qty > 99 then raise exception 'invalid_qty'; end if;

    select * into v_variant from public.product_variants
      where id = (v_item->>'variant_id')::uuid and active for update;
    if not found then raise exception 'variant_unavailable'; end if;

    select * into v_product from public.products
      where id = v_variant.product_id and status = 'published';
    if not found then raise exception 'product_unavailable'; end if;

    if v_variant.stock < v_qty then raise exception 'insufficient_stock'; end if;

    v_unit := case when v_currency = 'TND'
      then coalesce(v_variant.sale_price_tnd, v_variant.price_tnd)
      else coalesce(v_variant.sale_price_eur, v_variant.price_eur) end;
    v_line := round(v_unit * v_qty, v_dec);
    v_subtotal := v_subtotal + v_line;

    select coalesce(jsonb_object_agg(ov.key, ov.name), '{}'::jsonb) into v_labels
      from public.product_option_values ov where ov.id = any(v_variant.option_value_ids);

    insert into public.order_items (order_id, variant_id, product_name, variant_label, sku, unit_price, qty, line_total)
    values (v_order_id, v_variant.id, v_product.name, v_labels, v_variant.sku, v_unit, v_qty, v_line);

    update public.product_variants set stock = stock - v_qty where id = v_variant.id;
  end loop;

  if v_code is not null then
    v_coupon := public.validate_coupon(v_code, v_market, v_subtotal);
    if (v_coupon->>'valid')::boolean then
      v_discount := (v_coupon->>'discount')::numeric;
      update public.coupons set used_count = used_count + 1 where code = upper(trim(v_code));
    else
      raise exception 'coupon_%', v_coupon->>'reason';
    end if;
  end if;

  if v_ship.free_over is not null and (v_subtotal - v_discount) >= v_ship.free_over then
    v_shipping_fee := 0;
  else
    v_shipping_fee := v_ship.fee;
  end if;

  v_total := round(v_subtotal - v_discount + v_shipping_fee, v_dec);

  update public.orders set subtotal = v_subtotal, discount = v_discount, shipping_fee = v_shipping_fee, total = v_total
    where id = v_order_id;

  return jsonb_build_object('reference', v_ref, 'total', v_total, 'currency', v_currency,
    'subtotal', v_subtotal, 'discount', v_discount, 'shipping_fee', v_shipping_fee, 'duplicate', false);
end $$;

grant execute on function public.validate_coupon(text, text, numeric) to anon, authenticated, service_role;
grant execute on function public.place_order(jsonb) to anon, authenticated, service_role;