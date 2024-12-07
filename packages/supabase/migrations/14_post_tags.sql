ALTER TABLE IF EXISTS public.posts
ADD COLUMN tags text [] not null DEFAULT '{}';