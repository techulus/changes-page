ALTER TABLE public.users ADD COLUMN pro_gifted boolean DEFAULT false;

CREATE
OR REPLACE FUNCTION is_subscription_active (user_id uuid) RETURNS BOOLEAN AS $$
DECLARE
    subscription_status TEXT;
    is_gifted boolean;
BEGIN
    SELECT pro_gifted INTO is_gifted
    FROM public.users
    WHERE id = user_id;

    IF is_gifted IS TRUE THEN
        RETURN TRUE;
    END IF;

    SELECT 
      stripe_subscription->>'status' INTO subscription_status
    FROM public.users
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
