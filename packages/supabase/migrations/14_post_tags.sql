ALTER TABLE IF EXISTS public.posts
ADD COLUMN tags text [] not null DEFAULT '{}';

UPDATE posts
SET tags = array_append(tags, type::text);

ALTER TABLE posts
DROP COLUMN type;