create type page_color_scheme as enum ('auto', 'dark', 'light');

ALTER TABLE IF EXISTS public.page_settings
ADD COLUMN color_scheme page_color_scheme not null default 'auto';