-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  name text,
  college text,
  avatar_url text,
  role text default 'user',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

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

-- Create a view for leaderboard
create view global_leaderboard as
select 
  p.id as user_id,
  p.name,
  p.college,
  p.avatar_url,
  sum(gs.score) as total_score,
  round(avg(gs.accuracy)) as avg_accuracy,
  count(gs.id) as total_games,
  sum(gs.time_spent) as total_time
from profiles p
join game_sessions gs on p.id = gs.user_id
group by p.id, p.name, p.college, p.avatar_url;

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
