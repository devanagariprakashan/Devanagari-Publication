-- Run in the Supabase SQL editor before using the Team and Blog admin editors.
create table if not exists public.page_content (
  slug text primary key check (slug in ('team', 'blog', 'hero')),
  content jsonb not null
);
alter table public.page_content drop constraint if exists page_content_slug_check;
alter table public.page_content add constraint page_content_slug_check check (slug in ('team', 'blog', 'hero'));
alter table public.page_content enable row level security;
drop policy if exists "Public can read page content" on public.page_content;
drop policy if exists "Admins can manage page content" on public.page_content;
create policy "Public can read page content" on public.page_content for select using (true);
create policy "Admins can manage page content" on public.page_content for all to authenticated
using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
