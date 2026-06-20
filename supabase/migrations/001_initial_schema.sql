-- ============================================================
-- profiles
-- ============================================================
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  height_cm   numeric(5,1),
  goal_weight numeric(5,1),
  unit_pref   text not null default 'kg' check (unit_pref in ('kg', 'lbs')),
  accent_color text not null default '#a3e635',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: select own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================================
-- weight_entries
-- ============================================================
create table public.weight_entries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users on delete cascade not null,
  weight     numeric(5,1) not null,
  logged_at  timestamptz not null default now(),
  note       text,
  body_fat   numeric(4,1),
  created_at timestamptz not null default now()
);

alter table public.weight_entries enable row level security;

create policy "entries: select own"
  on public.weight_entries for select
  using (auth.uid() = user_id);

create policy "entries: insert own"
  on public.weight_entries for insert
  with check (auth.uid() = user_id);

create policy "entries: update own"
  on public.weight_entries for update
  using (auth.uid() = user_id);

create policy "entries: delete own"
  on public.weight_entries for delete
  using (auth.uid() = user_id);

-- Fast time-series queries per user
create index weight_entries_user_logged_at_idx
  on public.weight_entries (user_id, logged_at desc);

-- ============================================================
-- auto-create profile row on sign-up
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
