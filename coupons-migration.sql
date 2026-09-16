-- Run in the Supabase SQL editor before using the Coupons admin section.
create table if not exists public.coupons (
  id text primary key,
  code text not null,
  title text,
  discount_type text not null default 'percent',
  discount_value numeric not null default 0,
  min_amount numeric not null default 0,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.coupons drop constraint if exists coupons_discount_type_check;
alter table public.coupons add constraint coupons_discount_type_check check (discount_type in ('percent', 'fixed'));

create index if not exists coupons_code_idx on public.coupons (upper(code));

grant all on public.coupons to anon, authenticated, service_role;

-- Seed the codes that were previously hardcoded in the cart/checkout/PayU flow,
-- plus the advertised UPSC25 which previously did nothing.
insert into public.coupons (id, code, title, discount_type, discount_value, min_amount, is_active, is_featured) values
  ('coupon-upsc25',    'UPSC25',    'Save 25% on 2025 Exam Editions', 'percent', 25, 0,   true, true),
  ('coupon-deva10',    'DEVA10',    'Save 10% on your order',         'percent', 10, 0,   true, false),
  ('coupon-student50', 'STUDENT50', 'Flat ₹50 off on orders above ₹399', 'fixed', 50, 399, true, false)
on conflict (id) do nothing;
