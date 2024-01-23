ALTER TABLE IF EXISTS public.page_settings
    ADD COLUMN app_store_url text;
ALTER TABLE IF EXISTS public.page_settings
    ADD COLUMN play_store_url text;
ALTER TABLE IF EXISTS public.page_settings
    ADD COLUMN pinned_post_id uuid;