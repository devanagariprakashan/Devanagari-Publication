-- Run this in Supabase SQL Editor before enabling iThink Logistics shipments.
alter table public.orders add column if not exists shipment_status text default 'pending';
alter table public.orders add column if not exists shipment_id text;
alter table public.orders add column if not exists awb_number text;
alter table public.orders add column if not exists shipment_error text;
alter table public.orders add column if not exists shipment_response jsonb;

create table if not exists public.order_items (
  id text primary key,
  order_id text not null references public.orders(id) on delete cascade,
  book_id text references public.books(id),
  product_name text not null,
  product_sku text,
  quantity integer not null check (quantity > 0),
  unit_price numeric not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);
grant all on public.order_items to anon, authenticated, service_role;
