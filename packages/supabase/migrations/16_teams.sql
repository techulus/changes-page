-- TEAMS table
create table teams (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references users not null,
  name text not null,
  image text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table teams add constraint name_length check (length(name) >= 3);

alter table teams enable row level security;
create policy "Can insert teams." on teams for insert with check (auth.uid() = owner_id);
create policy "Can view own teams." on teams for select using (auth.uid() = owner_id);
create policy "Can update own teams." on teams for update using (auth.uid() = owner_id);
create policy "Can delete own teams." on teams for delete using (auth.uid() = owner_id);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON teams
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- TEAM MEMBERS table
create table team_members (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references teams not null,
  user_id uuid references users not null,
  role text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table team_members add constraint unique_team_user unique (team_id, user_id);

alter table team_members enable row level security;
create policy "Owner can view own team members." on team_members for select using (team_id in (select id from teams where owner_id = auth.uid()));
create policy "Owner can delete own team members." on team_members for delete using (team_id in (select id from teams where owner_id = auth.uid()));
create policy "Team members can leave their team." on team_members for delete using (user_id = auth.uid());

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON team_members
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- TEAM INVITATIONS table
create table team_invitations (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references teams not null,
  inviter_id uuid references users not null,
  email text not null,
  role text not null,
  status text not null,
  expires_at timestamp with time zone not null default timezone('utc'::text, now() + interval '1 day'),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table team_invitations add constraint unique_email_team_id unique (email, team_id);

alter table team_invitations enable row level security;
create policy "Can view own team invitations." on team_invitations for select using (auth.uid() = inviter_id);
create policy "Can delete own team invitations." on team_invitations for delete using (auth.uid() = inviter_id);
create policy "Can view team invitations." on team_invitations for select using (auth.email() = email);
create policy "Invited users can view teams." on teams for select using (id in (select team_id from team_invitations where email = auth.email()));

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON team_invitations
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Helper function to check if a user is a member of a team
create or replace function is_team_member(tid uuid, uid uuid) returns boolean as $$
begin
  return exists (select 1 from team_members where team_id = tid and user_id = uid);
end;
$$ language plpgsql security definer;

-- Policies using the helper function
create policy "Team members can view their membership." on team_members for select using (is_team_member(team_id, auth.uid()));
create policy "Members can view teams." on teams for select using (is_team_member(id, auth.uid()));

-- Alter pages table to add team_id
alter table pages add column team_id uuid references teams on delete set null;

-- Teams members can view pages in their team and posts in those pages
create policy "Can view pages in own team." on pages for select using (team_id in (select team_id from team_members where user_id = auth.uid()));

-- Update page_settings
alter policy "Can view own page_settings." on page_settings using (page_id in (select id from pages));
alter policy "Can update own page_settings." on page_settings using (page_id in (select id from pages));
drop policy "Can delete own page_settings." on page_settings;

alter table page_settings drop column user_id;

-- Update posts
alter policy "Can view own posts." on posts using (page_id in (select id from pages));
alter policy "Can update own posts." on posts using (page_id in (select id from pages));
alter policy "Can delete own posts." on posts using (page_id in (select id from pages));

-- Audit logs table
create table page_audit_logs (
  id uuid default uuid_generate_v4() primary key,
  page_id uuid references pages not null,
  actor_id uuid references users not null,
  action text not null,
  changes jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table page_audit_logs enable row level security;
create policy "Can insert page audit logs." on page_audit_logs for insert with check (actor_id = auth.uid());