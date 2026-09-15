-- Run in Supabase SQL editor to enable per-book demos.
alter table public.books add column if not exists demo_file_url text;
alter table public.books add column if not exists demo_video_url text;
