CREATE OR REPLACE FUNCTION is_subscription_active(user_id uuid) RETURNS BOOLEAN AS $$
DECLARE
    subscription_status TEXT;
BEGIN
    SELECT 
      stripe_subscription->>'status' INTO subscription_status
    FROM users
    WHERE id = user_id;

    IF subscription_status IS NULL THEN
        RETURN TRUE;
    END IF;

    IF subscription_status IS NOT NULL AND subscription_status != 'canceled' THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;