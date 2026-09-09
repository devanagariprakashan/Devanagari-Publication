-- Devanagari Publications storefront schema (no RLS)

create table if not exists public.profiles (
  id uuid primary key references auth.users(id),
  email text unique not null,
  role text default 'customer',
  full_name text,
  phone text,
  is_active boolean default true,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create table if not exists public.categories (
  id text primary key,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create table if not exists public.books (
  id text primary key,
  slug text unique not null,
  title text not null,
  hindi_title text,
  subtitle text,
  author text,
  category_id text references public.categories(id),
  isbn text,
  edition text,
  language text,
  exam text,
  format text,
  price numeric not null,
  original_price numeric,
  discount_percent numeric default 0,
  rating numeric default 0,
  reviews_count integer default 0,
  badge text,
  badge_color text,
  image_url text,
  description text,
  highlights jsonb,
  pages integer,
  publication text,
  binding text,
  in_stock boolean default true,
  is_bestseller boolean default false,
  is_new_release boolean default false,
  is_featured boolean default false,
  show_in_hero boolean default false,
  is_active boolean default true,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Add column to existing books table (create table if not exists won't alter it)
alter table public.books add column if not exists show_in_hero boolean default false;

create table if not exists public.authors (
  id text primary key,
  name text not null,
  role text,
  short_role text,
  bio text,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create table if not exists public.orders (
  id text primary key,
  order_number text unique not null,
  customer_name text,
  customer_email text,
  customer_phone text,
  total_amount numeric not null,
  order_status text default 'pending',
  payment_status text default 'pending',
  created_at timestamptz default timezone('utc'::text, now()) not null,
  cancelled_at timestamptz
);

create table if not exists public.reviews (
  id text primary key,
  book_id text references public.books(id),
  user_id uuid references public.profiles(id),
  rating integer,
  comment text,
  reviewer_name text,
  is_approved boolean default false,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create table if not exists public.inquiries (
  id text primary key,
  name text not null,
  email text,
  phone text,
  message text not null,
  status text default 'unread',
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create table if not exists public.announcements (
  id text primary key,
  text text not null,
  is_active boolean default true,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- What's New featured slider slides (app enforces max 4 active)
create table if not exists public.whats_new_slides (
  id text primary key,
  badge text,
  kicker text,
  title text not null,
  subtitle text,
  cta text,
  href text,
  cover text,
  sort integer default 0,
  is_active boolean default true,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Latest Updates panel items (home shows first 4 active by sort)
create table if not exists public.latest_updates (
  id text primary key,
  title text not null,
  note text,
  date_text text,
  image text,
  href text,
  sort integer default 0,
  is_active boolean default true,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Author social links
alter table public.authors add column if not exists youtube_url text;
alter table public.authors add column if not exists linkedin_url text;
alter table public.authors add column if not exists twitter_url text;
alter table public.authors add column if not exists instagram_url text;

-- ponytail: single-row table (id=1), add columns when admin truly needs new fields
create table if not exists public.site_settings (
  id integer primary key,
  full_name text,
  email text,
  phones text,
  address text,
  youtube_url text,
  whatsapp_url text,
  instagram_url text,
  telegram_url text,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Grant access to Supabase roles (RLS is off, so explicit grants are required)
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
