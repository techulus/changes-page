create table post_reactions (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  visitor_id uuid not null,
  thumbs_up boolean not null default false,
  thumbs_down boolean not null default false,
  rocket boolean not null default false,
  sad boolean not null default false,
  heart boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table post_reactions enable row level security;

DROP FUNCTION post_reactions_aggregate;
CREATE OR REPLACE FUNCTION post_reactions_aggregate(postid uuid)
RETURNS TABLE(thumbs_up_count bigint, thumbs_down_count bigint, rocket_count bigint, sad_count bigint, heart_count bigint)
AS $$
BEGIN
  RETURN QUERY
  SELECT
    SUM(CASE WHEN thumbs_up = true THEN 1 ELSE 0 END) AS thumbs_up_count,
    SUM(CASE WHEN thumbs_down = true THEN 1 ELSE 0 END) AS thumbs_down_count,
    SUM(CASE WHEN rocket = true THEN 1 ELSE 0 END) AS rocket_count,
    SUM(CASE WHEN sad = true THEN 1 ELSE 0 END) AS sad_count,
    SUM(CASE WHEN heart = true THEN 1 ELSE 0 END) AS heart_count
  FROM post_reactions
  WHERE post_id = postid;
END;
$$ LANGUAGE 'plpgsql';

ALTER TABLE IF EXISTS public.posts ADD COLUMN allow_reactions boolean default false;
