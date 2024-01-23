ALTER TABLE IF EXISTS public.posts
    ADD COLUMN publish_at timestamp with time zone;
ALTER TYPE public.post_status
    ADD VALUE 'publish_later' AFTER 'archived';

/**
* REVALIDATE QUEUE
*/
create table revalidate_queue (
                                  id uuid default uuid_generate_v4() primary key,
                                  payload json not null,
                                  trigger_at timestamp with time zone not null,
                                  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table revalidate_queue enable row level security;
