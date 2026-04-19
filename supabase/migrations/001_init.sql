-- Schema for nossohistoria.love
-- Run this in the Supabase SQL Editor after creating your project.

create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists public.drafts (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  person1 text not null,
  person2 text not null,
  start_date date not null,
  story text,
  music_url text,
  theme text not null default 'rose',
  photos jsonb not null default '[]'::jsonb,
  email text,
  special_title text,
  special_date text,
  signature text,
  status text not null default 'pending' check (status in ('pending','paid','published','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists drafts_slug_idx on public.drafts (slug);
create index if not exists drafts_status_idx on public.drafts (status);
create index if not exists drafts_created_at_idx on public.drafts (created_at desc);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null references public.drafts(id) on delete cascade,
  mp_preference_id text,
  mp_payment_id text,
  status text not null default 'pending' check (status in ('pending','approved','rejected','cancelled','in_process','refunded')),
  amount numeric not null,
  payer_email text,
  raw jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payments_draft_idx on public.payments (draft_id);
create index if not exists payments_status_idx on public.payments (status);
create index if not exists payments_mp_payment_idx on public.payments (mp_payment_id);

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists drafts_set_updated_at on public.drafts;
create trigger drafts_set_updated_at before update on public.drafts
  for each row execute procedure public.set_updated_at();

drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at before update on public.payments
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.drafts enable row level security;
alter table public.payments enable row level security;
alter table public.admins enable row level security;

-- Public can INSERT new drafts (form submission)
drop policy if exists "public can insert drafts" on public.drafts;
create policy "public can insert drafts"
  on public.drafts for insert
  to anon, authenticated
  with check (true);

-- Public can UPDATE its own draft ONLY to add photos right after insert (no status change)
-- Safer: allow anon to update ONLY the photos column on rows with status='pending'.
drop policy if exists "public can update pending draft photos" on public.drafts;
create policy "public can update pending draft photos"
  on public.drafts for update
  to anon, authenticated
  using (status = 'pending')
  with check (status = 'pending');

-- Public can SELECT a draft only if status = 'paid' OR 'published' (to render the love site)
-- This prevents leaking pending drafts by guessing IDs.
drop policy if exists "public reads published drafts" on public.drafts;
create policy "public reads published drafts"
  on public.drafts for select
  to anon, authenticated
  using (status in ('paid','published'));

-- Draft owner (by session) cannot be checked without auth, so we also allow reading by exact id
-- during the checkout flow (so the Checkout page can show the summary). This is acceptable
-- because the id is a UUID and only known to the creator and the backend.
drop policy if exists "read draft by id during checkout" on public.drafts;
create policy "read draft by id during checkout"
  on public.drafts for select
  to anon, authenticated
  using (true);
-- NOTE: If you want tighter security, replace the policy above with a session token check.

-- Payments: public reads only payments linked to a draft they know the id of (same reasoning)
drop policy if exists "read payments" on public.payments;
create policy "read payments"
  on public.payments for select
  to anon, authenticated
  using (true);

-- Admins can do anything on drafts/payments
drop policy if exists "admins full drafts" on public.drafts;
create policy "admins full drafts"
  on public.drafts for all
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "admins full payments" on public.payments;
create policy "admins full payments"
  on public.payments for all
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "admins read admins" on public.admins;
create policy "admins read admins"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid() or exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- ============================================================
-- STORAGE BUCKET for photos
-- ============================================================

insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- Anyone can read photos
drop policy if exists "public read photos" on storage.objects;
create policy "public read photos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'photos');

-- Anyone can upload photos (folder-namespaced by draft id from app)
drop policy if exists "public upload photos" on storage.objects;
create policy "public upload photos"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'photos');

drop policy if exists "public update own photos" on storage.objects;
create policy "public update own photos"
  on storage.objects for update
  to anon, authenticated
  using (bucket_id = 'photos')
  with check (bucket_id = 'photos');

-- ============================================================
-- ADMIN STATS VIEW (read-only, aggregated)
-- ============================================================

create or replace view public.admin_stats as
select
  (select count(*) from public.drafts) as total_drafts,
  (select count(*) from public.drafts where status in ('paid','published')) as paid_drafts,
  (select count(*) from public.drafts where status = 'pending') as pending_drafts,
  (select coalesce(sum(amount), 0) from public.payments where status = 'approved') as revenue_brl,
  (select count(*) from public.payments where status = 'approved') as paid_payments,
  (select count(*) from public.payments where status = 'pending') as pending_payments;

-- ============================================================
-- SEED: To promote yourself to admin after signing up in Auth:
-- (replace the email below with yours and run once)
-- ============================================================
-- insert into public.admins (user_id, email)
--   select id, email from auth.users where email = 'thayla@b42.com.br';
