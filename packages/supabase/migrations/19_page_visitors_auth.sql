-- PAGE VISITORS table for email-based authentication
create table page_visitors (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  email_verified boolean not null default false,
  verification_token text,
  verification_expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table page_visitors enable row level security;

-- Index for faster lookups by email and token
create index idx_page_visitors_email on page_visitors(email);
create index idx_page_visitors_verification_token on page_visitors(verification_token);
create index idx_page_visitors_verification_expires on page_visitors(verification_expires_at);

-- Trigger for updated_at
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON page_visitors
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
