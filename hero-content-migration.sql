-- Run once in Supabase SQL editor to enable Hero Section saves.
-- Preserves existing Team and Blog content and policies.
alter table public.page_content drop constraint if exists page_content_slug_check;
alter table public.page_content add constraint page_content_slug_check check (slug in ('team', 'blog', 'hero'));
