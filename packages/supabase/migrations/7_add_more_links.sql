ALTER TABLE IF EXISTS public.page_settings
    ADD COLUMN youtube_url text;
ALTER TABLE IF EXISTS public.page_settings
    ADD COLUMN tiktok_url text;
ALTER TABLE IF EXISTS public.page_settings
    ADD COLUMN linkedin_url text;
ALTER TABLE IF EXISTS public.page_settings
    ADD COLUMN product_url text;