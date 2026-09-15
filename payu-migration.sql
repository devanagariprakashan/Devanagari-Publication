-- Run this in Supabase SQL editor before enabling PayU payments.
alter table public.orders add column if not exists payment_gateway text;
alter table public.orders add column if not exists payment_method text;
alter table public.orders add column if not exists gateway_order_id text;
alter table public.orders add column if not exists payment_id text;
alter table public.orders add column if not exists shipping_address text;
alter table public.orders add column if not exists landmark text;
alter table public.orders add column if not exists city text;
alter table public.orders add column if not exists state text;
alter table public.orders add column if not exists pincode text;
