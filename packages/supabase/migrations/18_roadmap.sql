-- ROADMAP BOARDS table
create table roadmap_boards (
  id uuid default uuid_generate_v4() primary key,
  page_id uuid references pages(id) on delete cascade not null,
  title text not null,
  description text,
  slug text not null,
  is_public boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table roadmap_boards add constraint unique_page_slug unique (page_id, slug);
alter table roadmap_boards add constraint slug_length check (length(slug) >= 1);

alter table roadmap_boards enable row level security;
create policy "Can view public roadmap boards." on roadmap_boards for select using (is_public = true);
create policy "Can view own page roadmap boards." on roadmap_boards for select using (page_id in (select id from pages));
create policy "Can insert own page roadmap boards." on roadmap_boards for insert with check (page_id in (select id from pages));
create policy "Can update own page roadmap boards." on roadmap_boards for update using (page_id in (select id from pages));
create policy "Can delete own page roadmap boards." on roadmap_boards for delete using (page_id in (select id from pages));

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON roadmap_boards
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- ROADMAP COLUMNS table
create table roadmap_columns (
  id uuid default uuid_generate_v4() primary key,
  board_id uuid references roadmap_boards(id) on delete cascade not null,
  name text not null,
  position integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table roadmap_columns add constraint unique_board_position unique (board_id, position);
alter table roadmap_columns add constraint unique_board_name unique (board_id, name);

alter table roadmap_columns enable row level security;
create policy "Can view public roadmap columns." on roadmap_columns for select using (board_id in (select id from roadmap_boards where is_public = true));
create policy "Can view own roadmap columns." on roadmap_columns for select using (board_id in (select id from roadmap_boards where page_id in (select id from pages)));
create policy "Can insert own roadmap columns." on roadmap_columns for insert with check (board_id in (select id from roadmap_boards where page_id in (select id from pages)));
create policy "Can update own roadmap columns." on roadmap_columns for update using (board_id in (select id from roadmap_boards where page_id in (select id from pages)));
create policy "Can delete own roadmap columns." on roadmap_columns for delete using (board_id in (select id from roadmap_boards where page_id in (select id from pages)));

-- ROADMAP CATEGORIES table
create table roadmap_categories (
  id uuid default uuid_generate_v4() primary key,
  board_id uuid references roadmap_boards(id) on delete cascade not null,
  name text not null,
  color text default 'blue' check (color in (
    'blue', 'indigo', 'purple', 'pink', 'red', 
    'orange', 'yellow', 'green', 'emerald', 'cyan'
  )),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table roadmap_categories add constraint unique_board_category_name unique (board_id, name);
alter table roadmap_categories add constraint category_name_length check (length(name) >= 1);

alter table roadmap_categories enable row level security;
create policy "Can view public roadmap categories." on roadmap_categories for select using (board_id in (select id from roadmap_boards where is_public = true));
create policy "Can view own roadmap categories." on roadmap_categories for select using (board_id in (select id from roadmap_boards where page_id in (select id from pages)));
create policy "Can insert own roadmap categories." on roadmap_categories for insert with check (board_id in (select id from roadmap_boards where page_id in (select id from pages)));
create policy "Can update own roadmap categories." on roadmap_categories for update using (board_id in (select id from roadmap_boards where page_id in (select id from pages)));
create policy "Can delete own roadmap categories." on roadmap_categories for delete using (board_id in (select id from roadmap_boards where page_id in (select id from pages)));

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON roadmap_categories
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- ROADMAP ITEMS table
create table roadmap_items (
  id uuid default uuid_generate_v4() primary key,
  board_id uuid references roadmap_boards(id) on delete cascade not null,
  column_id uuid references roadmap_columns(id) on delete cascade not null,
  category_id uuid references roadmap_categories(id) on delete set null,
  title text not null,
  description text,
  position integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table roadmap_items add constraint unique_column_position unique (column_id, position);

alter table roadmap_items enable row level security;
create policy "Can view public roadmap items." on roadmap_items for select using (board_id in (select id from roadmap_boards where is_public = true));
create policy "Can view own roadmap items." on roadmap_items for select using (board_id in (select id from roadmap_boards where page_id in (select id from pages)));
create policy "Can insert own roadmap items." on roadmap_items for insert with check (board_id in (select id from roadmap_boards where page_id in (select id from pages)));
create policy "Can update own roadmap items." on roadmap_items for update using (board_id in (select id from roadmap_boards where page_id in (select id from pages)));
create policy "Can delete own roadmap items." on roadmap_items for delete using (board_id in (select id from roadmap_boards where page_id in (select id from pages)));

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON roadmap_items
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- ROADMAP VOTES table (similar to post_reactions)
create table roadmap_votes (
  id uuid default uuid_generate_v4() primary key,
  item_id uuid references roadmap_items(id) on delete cascade not null,
  visitor_id uuid not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table roadmap_votes add constraint unique_item_visitor unique (item_id, visitor_id);

alter table roadmap_votes enable row level security;

-- Function to initialize default columns for a roadmap board
CREATE OR REPLACE FUNCTION initialize_roadmap_columns(board_id uuid)
RETURNS void
AS $$
BEGIN
  INSERT INTO roadmap_columns (board_id, name, position) VALUES
    (board_id, 'Backlog', 1),
    (board_id, 'Planned', 2),
    (board_id, 'In Progress', 3),
    (board_id, 'Done', 4);
END;
$$ LANGUAGE 'plpgsql';

-- Function to initialize default categories for a roadmap board
CREATE OR REPLACE FUNCTION initialize_roadmap_categories(board_id uuid)
RETURNS void
AS $$
BEGIN
  INSERT INTO roadmap_categories (board_id, name) VALUES
    (board_id, 'Feature'),
    (board_id, 'Bug Fix'),
    (board_id, 'Improvement');
END;
$$ LANGUAGE 'plpgsql';
