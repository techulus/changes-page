ALTER TABLE IF EXISTS public.page_settings
ADD COLUMN email_notifications boolean not null default false;
ALTER TABLE IF EXISTS public.page_settings
ADD COLUMN rss_notifications boolean not null default false;
ALTER TABLE IF EXISTS public.page_settings
    ADD COLUMN email_reply_to text;
ALTER TABLE IF EXISTS public.page_settings
    ADD COLUMN email_physical_address text;

create table page_email_subscribers (
  id uuid default uuid_generate_v4() primary key,
  page_id uuid references pages(id) on delete cascade not null,
  recipient_id uuid not null,
  email text not null,
  status text not null,
  valid_till timestamp with time zone default timezone('utc'::text, now() + interval '10 minute') not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
CREATE TRIGGER set_timestamp_page_email_subscribers
    BEFORE UPDATE ON page_email_subscribers
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

alter table page_email_subscribers enable row level security;

ALTER TABLE IF EXISTS public.posts
    ADD COLUMN email_notified boolean not null default false;

DROP TABLE revalidate_queue;
