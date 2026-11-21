-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  name text,
  college text,
  department text,
  avatar_url text,
  role text default 'user',
  is_blocked boolean default false,
  warning_message text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Migrations for existing installations:
-- alter table profiles add column if not exists department text;
-- alter table profiles add column if not exists warning_message text;

-- Create a table for game sessions
create table game_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  game_id text not null,
  level integer not null,
  score integer not null,
  accuracy integer not null, -- percentage 0-100
  time_spent integer not null, -- in seconds
  passed_distraction boolean,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;
alter table game_sessions enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Policies for game_sessions
create policy "Game sessions are viewable by everyone."
  on game_sessions for select
  using ( true );

create policy "Users can insert their own game sessions."
  on game_sessions for insert
  with check ( auth.uid() = user_id );

-- Helper function to check if caller has 'admin' role
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Admin RLS Policies
create policy "Admins have full access to profiles"
  on profiles for all
  to authenticated
  using ( is_admin() )
  with check ( is_admin() );

create policy "Admins have full access to game_sessions"
  on game_sessions for all
  to authenticated
  using ( is_admin() )
  with check ( is_admin() );

-- Create a view for leaderboard with DISTINCT LEVEL SCORING (excludes blocked accounts and prevents replay farming)
create or replace view global_leaderboard as
with distinct_level_scores as (
  select 
    user_id,
    game_id,
    level,
    max(score) as best_score,
    round(avg(accuracy)) as level_acc,
    min(time_spent) as best_time
  from game_sessions
  where level <= 50
  group by user_id, game_id, level
)
select 
  p.id as user_id,
  p.name,
  p.college,
  p.avatar_url,
  coalesce(sum(dls.best_score), 0) as total_score,
  coalesce(round(avg(dls.level_acc)), 0) as avg_accuracy,
  count(dls.level) as total_games,
  coalesce(sum(dls.best_time), 0) as total_time
from profiles p
join distinct_level_scores dls on p.id = dls.user_id
where (p.is_blocked is not true)
group by p.id, p.name, p.college, p.avatar_url;

-- Create a view for specific game leaderboards with DISTINCT LEVEL SCORING
create or replace view game_leaderboard as
with distinct_level_scores as (
  select 
    user_id,
    game_id,
    level,
    max(score) as best_score,
    round(avg(accuracy)) as level_acc,
    min(time_spent) as best_time
  from game_sessions
  where level <= 50
  group by user_id, game_id, level
)
select 
  dls.game_id,
  p.id as user_id,
  p.name,
  p.college,
  p.avatar_url,
  coalesce(sum(dls.best_score), 0) as total_score,
  coalesce(round(avg(dls.level_acc)), 0) as avg_accuracy,
  count(dls.level) as total_games,
  coalesce(sum(dls.best_time), 0) as total_time
from profiles p
join distinct_level_scores dls on p.id = dls.user_id
where (p.is_blocked is not true)
group by dls.game_id, p.id, p.name, p.college, p.avatar_url;

-- Setup triggers to automatically create a profile when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create a table for feedback
create table feedback (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  rating integer not null,
  tag text,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table feedback enable row level security;

create policy "Feedback is viewable by everyone."
  on feedback for select
  using ( true );

create policy "Anyone can insert feedback."
  on feedback for insert
  with check ( true );

-- Create a table for bug reports and contact us messages
create table bug_reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  title text not null,
  description text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table bug_reports enable row level security;

create policy "Bug reports are viewable by everyone."
  on bug_reports for select
  using ( true );

create policy "Anyone can insert bug reports."
  on bug_reports for insert
  with check ( true );

-- Reset fake/abbreviated colleges & enforce dropdown re-selection:
-- UPDATE profiles
-- SET college = NULL, department = NULL
-- WHERE college IS NULL
--    OR LENGTH(TRIM(college)) < 5
--    OR LOWER(TRIM(college)) IN (
--      'abc', 'xyz', 'test', 'demo', 'fake', 'none', 'na', 'n/a', 'asdf', 'qwerty',
--      '...', '---', 'other', 'unknown', 'invalid', 'dummy', 'null', 'nil', 'college',
--      'cit', 'tki', 'aps', 'vsb', 'iitk', 'ycce', 'gla', 'iem', 'uem', 'siom', 'sfax', 'j', 'san'
--    )
--    OR department IS NULL;