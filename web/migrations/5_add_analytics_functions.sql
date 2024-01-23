drop function page_view_stats;
CREATE or replace FUNCTION page_view_stats(pageid uuid, date timestamp with time zone) RETURNS RECORD AS $$
DECLARE 
  ret RECORD;
BEGIN
  select 
    count(*) as page_views,
    count(distinct visitor_id) as visitors
  from page_views
  where page_id = pageid AND DATE(created_at) >= DATE(date) 
  into ret;
RETURN ret;
END;$$ LANGUAGE plpgsql;

drop function page_view_browsers;
CREATE OR REPLACE FUNCTION page_view_browsers(pageid uuid, date timestamp with time zone)
RETURNS TABLE(data_name text, data_count bigint)
AS $$
BEGIN
  RETURN QUERY
  select 
    browser as data_name,
    count(browser) as data_count
  from 
    page_views
  where 
    browser is not null and page_id = pageid AND DATE(created_at) >= DATE(date) 
  group
    by browser
  order by
    data_count desc
  limit 5;
END;
$$ LANGUAGE 'plpgsql';

drop function page_view_referrers;
CREATE OR REPLACE FUNCTION page_view_referrers(pageid uuid, date timestamp with time zone)
RETURNS TABLE(data_name text, data_count bigint)
AS $$
BEGIN
  RETURN QUERY
  select 
    referrer as data_name,
    count(referrer) as data_count
  from 
    page_views
  where 
    referrer is not null and coalesce(TRIM(referrer), '') != '' and page_id = pageid AND DATE(created_at) >= DATE(date) 
  group by
    referrer
  order by
    data_count desc
  limit 5;
END;
$$ LANGUAGE 'plpgsql';

drop function page_view_os;
CREATE OR REPLACE FUNCTION page_view_os(pageid uuid, date timestamp with time zone)
RETURNS TABLE(data_name text, data_count bigint)
AS $$
BEGIN
  RETURN QUERY
  select 
    os as data_name,
    count(os) as data_count
  from 
    page_views
  where 
    os is not null and coalesce(TRIM(os), '') != '' and page_id = pageid AND DATE(created_at) >= DATE(date) 
  group by
    os
  order by
    data_count desc
  limit 5;
END;
$$ LANGUAGE 'plpgsql';