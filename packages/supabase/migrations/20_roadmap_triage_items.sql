create table roadmap_triage_items (
  id uuid default uuid_generate_v4() primary key,
  board_id uuid references roadmap_boards(id) on delete cascade not null,
  title text not null,
  description text,
  visitor_id uuid references page_visitors(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index roadmap_triage_items_board_id_idx on roadmap_triage_items(board_id);

alter table roadmap_triage_items enable row level security;

create policy "Page owners can view triage items." on roadmap_triage_items
  for select
  using (board_id in (select id from roadmap_boards where page_id in (select id from pages)));

create policy "Page owners can update triage items." on roadmap_triage_items
  for update
  using (board_id in (select id from roadmap_boards where page_id in (select id from pages)));

create policy "Page owners can delete triage items." on roadmap_triage_items
  for delete
  using (board_id in (select id from roadmap_boards where page_id in (select id from pages)));

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON roadmap_triage_items
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
