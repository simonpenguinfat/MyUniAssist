-- Optional: run in Supabase SQL editor if you want universities stored in the DB.
-- The app currently ships with the same dataset in src/lib/universities.ts so tools work immediately.

-- Statistics columns are nullable: the Common Data Set workbook genuinely does
-- not report every figure for every school, and the list builder distinguishes
-- "not reported" from a real value. Never default these to 0.
create table if not exists public.universities (
  id text primary key,
  name text not null,
  city text not null,
  state text not null,
  region text not null,
  us_news_rank int,
  acceptance_rate numeric,
  acceptance_rate_year text,
  avg_gpa numeric,
  sat_mid int,
  sat_25 int,
  sat_75 int,
  act_mid int,
  act_25 int,
  act_75 int,
  tuition_usd int,
  tuition_in_state_usd int,
  tuition_out_of_state_usd int,
  total_cost_usd int,
  is_public boolean not null default false,
  -- CDS section C7 importance scores, 4 = Very Important .. 1 = Not Considered,
  -- null where the school did not report that row. Shape matches
  -- AdmissionFactors in src/lib/universities.ts.
  admission_factors jsonb,
  admission_factors_year text,
  setting text not null,
  interests text not null,
  personality_fit text not null,
  extracurricular_fit text not null,
  vr_tour_url text not null,
  cds_url text not null,
  website_url text not null,
  size_band text not null
);

-- Bring an existing table up to date without dropping it.
alter table public.universities
  add column if not exists us_news_rank int,
  add column if not exists acceptance_rate_year text,
  add column if not exists sat_25 int,
  add column if not exists sat_75 int,
  add column if not exists act_25 int,
  add column if not exists act_75 int,
  add column if not exists tuition_usd int,
  add column if not exists tuition_in_state_usd int,
  add column if not exists tuition_out_of_state_usd int,
  add column if not exists total_cost_usd int,
  add column if not exists is_public boolean not null default false,
  add column if not exists admission_factors jsonb,
  add column if not exists admission_factors_year text;

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
