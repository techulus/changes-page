-- Drop the existing foreign key constraint
ALTER TABLE page_audit_logs 
DROP CONSTRAINT page_audit_logs_page_id_fkey;

-- Recreate the constraint with CASCADE DELETE
ALTER TABLE page_audit_logs 
ADD CONSTRAINT page_audit_logs_page_id_fkey 
FOREIGN KEY (page_id) 
REFERENCES pages(id) 
ON DELETE CASCADE;

-- Function to get pages with inactive subscriptions
CREATE OR REPLACE FUNCTION get_pages_with_inactive_subscriptions()
RETURNS TABLE (
  page_id uuid,
  page_title text,
  page_created_at timestamptz,
  url text,
  user_id uuid
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
      p.id AS page_id,
      p.title AS page_title,
      p.created_at AS page_created_at,
      p.url_slug AS url,
      u.id AS user_id
  FROM 
      pages p
  JOIN 
      users u ON p.user_id = u.id
  JOIN
      auth.users au ON u.id = au.id
  WHERE 
      (
        -- Users with canceled subscription
        (u.stripe_subscription->>'status')::text = 'canceled'
        -- OR users without any subscription
        OR u.stripe_subscription IS NULL
      )
      -- not gifted pro
      AND u.pro_gifted = false
      -- User hasn't been active in the last 180 days
      AND (au.last_sign_in_at IS NULL OR au.last_sign_in_at < NOW() - INTERVAL '180 days')
  ORDER BY 
      p.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;