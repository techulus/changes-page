create table github_installations (
  id uuid default uuid_generate_v4() primary key,
  page_id uuid references pages(id) on delete cascade not null,
  installation_id bigint not null,
  repository_owner text not null,
  repository_name text not null,
  connected_by uuid references users(id) on delete set null,
  enabled boolean default true not null,
  ai_instructions text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table github_installations add constraint unique_page_repo unique (page_id, repository_owner, repository_name);
alter table github_installations add constraint unique_installation_repo unique (installation_id, repository_owner, repository_name);

alter table github_installations enable row level security;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON github_installations
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

create table github_post_references (
  post_id uuid references posts(id) on delete cascade primary key,
  installation_id bigint not null,
  repository_owner text not null,
  repository_name text not null,
  pr_number integer not null,
  pr_url text not null,
  comment_id bigint,
  generation_count integer default 1 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table github_post_references
  add constraint unique_post_per_pr
  unique (repository_owner, repository_name, pr_number);

alter table github_post_references enable row level security;

CREATE TRIGGER set_timestamp_github_post_references
BEFORE UPDATE ON github_post_references
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE OR REPLACE FUNCTION update_github_changelog_draft(
  p_post_id uuid,
  p_title text,
  p_content text,
  p_tags text[]
)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  v_new_generation_count integer;
BEGIN
  UPDATE posts
  SET title = p_title, content = p_content, tags = p_tags
  WHERE id = p_post_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Post not found: %', p_post_id;
  END IF;

  UPDATE github_post_references
  SET generation_count = generation_count + 1
  WHERE post_id = p_post_id
  RETURNING generation_count INTO v_new_generation_count;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'GitHub post reference not found for post: %', p_post_id;
  END IF;

  RETURN v_new_generation_count;
END;
$$;
