/**
* USERS
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table users (
  -- UUID from auth.users
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  stripe_subscription jsonb
);
alter table users enable row level security;
create policy "Can view own user data." on users for select using (auth.uid() = id);
create policy "Can update own user data." on users for update using (auth.uid() = id);

/**
* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
*/
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

/**
* Trigger for updated_at
*/
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

/**
* PAGES
*/
create type page_type as enum ('changelogs', 'updates', 'releases', 'announcements');
create table pages (
  id uuid default uuid_generate_v4() primary key,
  url_slug text unique,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  type page_type not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table pages enable row level security;
create policy "Can view own pages." on pages for select using (auth.uid() = user_id);
create policy "Can update own pages." on pages for update using (auth.uid() = user_id);
create policy "Can delete own pages." on pages for delete using (auth.uid() = user_id);
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON pages
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

/**
* POSTS
*/
create type post_type as enum ('fix', 'new', 'improvement', 'announcement', 'alert');
create type post_status as enum ('draft', 'published', 'archived');
create table posts (
  id uuid default uuid_generate_v4() primary key,
  page_id uuid references pages(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  images_folder uuid not null,
  title text not null,
  content text not null,
  type post_type not null,
  status post_status not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table posts enable row level security;
create policy "Can view own posts." on posts for select using (auth.uid() = user_id);
create policy "Can update own posts." on posts for update using (auth.uid() = user_id);
create policy "Can delete own posts." on posts for delete using (auth.uid() = user_id);
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

/**
* PAGES SETTINGS
*/
create table page_settings (
  page_id uuid primary key references pages(id) on delete cascade not null,
  user_id uuid references auth.users not null,

  custom_domain text,

  accent_color text,
  page_logo text,
  cover_image text,
  replace_title_with_logo boolean,

  twitter_url text,
  facebook_url text,
  github_url text,
  instagram_url text,

  hide_search_engine boolean not null default false,
  whitelabel boolean not null default false,

  integration_secret_key uuid default uuid_generate_v4() unique,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table page_settings enable row level security;
create policy "Can view own page_settings." on page_settings for select using (auth.uid() = user_id);
create policy "Can update own page_settings." on page_settings for update using (auth.uid() = user_id);
create policy "Can delete own page_settings." on page_settings for delete using (auth.uid() = user_id);
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON page_settings
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
