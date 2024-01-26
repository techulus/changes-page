create table page_views (
  id uuid default uuid_generate_v4() primary key,
  page_id uuid references pages(id) on delete cascade not null,
  page_path text not null,
  visitor_id uuid not null,
  referrer text,
  os text,
  browser text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table page_views enable row level security;
