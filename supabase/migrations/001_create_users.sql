-- ===========================================================================
-- Belle Afrik — users table for Google OAuth (Supabase / Postgres)
-- Run this once in Supabase Dashboard > SQL Editor > New query > Run.
-- Project ref: vvfoaxsfkhcdgonbhqcv
-- ===========================================================================

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  avatar_url text,
  provider text not null default 'google',
  provider_account_id text,
  last_sign_in_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_provider_account_idx
  on public.users (provider, provider_account_id);

-- Safety: if the table already existed without the unique constraint,
-- this enforces one row per email so the app upsert works.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'users_email_key'
  ) then
    begin
      alter table public.users add constraint users_email_key unique (email);
    exception when duplicate_object then
      null;
    end;
  end if;
end $$;

-- The app writes via the Supabase REST API using the anon/service key, so RLS
-- policies are REQUIRED (anon key does NOT bypass RLS). These allow the
-- server-side upsert + reads while keeping the table closed to the public.
alter table public.users enable row level security;

drop policy if exists "service upsert users" on public.users;
create policy "service upsert users"
  on public.users for all
  using (true)
  with check (true);

drop policy if exists "service read users" on public.users;
create policy "service read users"
  on public.users for select
  using (true);
