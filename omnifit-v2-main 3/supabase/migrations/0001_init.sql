-- ============================================================
-- OMNIFIT CORE SCHEMA
-- Run this in Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

-- ---------- profiles ----------
-- One row per user. Username is optional (can be null).
-- active_equipment_profile_id + active_since let the progression
-- engine know how long you've been on your current setup, so it
-- can decide how conservative to be when you switch back.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  active_equipment_profile_id uuid, -- FK added after equipment_profiles exists
  active_since timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- ---------- equipment_profiles ----------
-- The "Full Gym" / "Partial Gym" presets. equipment is a simple
-- JSON array of strings, e.g. ["barbell","dumbbells:2.5-12.5kg","pull-up bar"]
create table if not exists public.equipment_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  equipment jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.equipment_profiles enable row level security;

create policy "equipment_profiles_select_own" on public.equipment_profiles
  for select using (auth.uid() = user_id);
create policy "equipment_profiles_insert_own" on public.equipment_profiles
  for insert with check (auth.uid() = user_id);
create policy "equipment_profiles_update_own" on public.equipment_profiles
  for update using (auth.uid() = user_id);
create policy "equipment_profiles_delete_own" on public.equipment_profiles
  for delete using (auth.uid() = user_id);

-- now that equipment_profiles exists, wire the FK on profiles
alter table public.profiles
  add constraint profiles_active_equipment_fk
  foreign key (active_equipment_profile_id)
  references public.equipment_profiles(id)
  on delete set null;

-- ---------- workouts ----------
-- One row per training session.
create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  day_type text not null check (day_type in ('push','pull','legs')),
  equipment_profile_id uuid references public.equipment_profiles(id),
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.workouts enable row level security;

create policy "workouts_select_own" on public.workouts
  for select using (auth.uid() = user_id);
create policy "workouts_insert_own" on public.workouts
  for insert with check (auth.uid() = user_id);
create policy "workouts_update_own" on public.workouts
  for update using (auth.uid() = user_id);
create policy "workouts_delete_own" on public.workouts
  for delete using (auth.uid() = user_id);

-- ---------- sets ----------
-- Every logged set within a workout. This is what the progression
-- engine reads to decide next session's targets.
create table if not exists public.sets (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id text not null,
  set_index int not null,
  reps int,
  weight numeric,
  assistance_level text, -- e.g. 'band-medium', null if not applicable
  done boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.sets enable row level security;

create policy "sets_select_own" on public.sets
  for select using (auth.uid() = user_id);
create policy "sets_insert_own" on public.sets
  for insert with check (auth.uid() = user_id);
create policy "sets_update_own" on public.sets
  for update using (auth.uid() = user_id);
create policy "sets_delete_own" on public.sets
  for delete using (auth.uid() = user_id);

-- ---------- auto-create profile on signup ----------
-- Whenever someone signs in via Google for the first time,
-- Supabase creates a row in auth.users. This trigger creates
-- a matching row in public.profiles automatically, so you don't
-- have to remember to do it manually in the frontend.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- helpful indexes ----------
create index if not exists idx_workouts_user_date on public.workouts(user_id, date desc);
create index if not exists idx_sets_workout on public.sets(workout_id);
create index if not exists idx_sets_user_exercise on public.sets(user_id, exercise_id, created_at desc);
