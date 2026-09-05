-- Optional: run in Supabase SQL editor if you want universities stored in the DB.
-- The app currently ships with the same dataset in src/lib/universities.ts so tools work immediately.

create table if not exists public.universities (
  id text primary key,
  name text not null,
  city text not null,
  state text not null,
  region text not null,
  acceptance_rate numeric not null,
  avg_gpa numeric not null,
  sat_mid int not null,
  act_mid int not null,
  setting text not null,
  interests text not null,
  personality_fit text not null,
  extracurricular_fit text not null,
  vr_tour_url text not null,
  cds_url text not null,
  website_url text not null,
  size_band text not null
);

alter table public.universities enable row level security;

create policy "Public read universities"
  on public.universities
  for select
  to anon, authenticated
  using (true);

-- Profiles (extends Supabase Auth users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
