-- Run this once in Supabase SQL Editor for an existing project.
alter table public.inquiries add column if not exists subject text;

create table if not exists public.newsletter_subscribers (
  id text primary key,
  email text unique not null,
  status text default 'active',
  created_at timestamptz default timezone('utc'::text, now()) not null
);

grant all on public.newsletter_subscribers to anon, authenticated, service_role;
