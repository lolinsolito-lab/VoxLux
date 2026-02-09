-- Update get_user_bonuses to include icons and upsells
DROP FUNCTION IF EXISTS get_user_bonuses;

CREATE OR REPLACE FUNCTION get_user_bonuses(p_user_id uuid)
RETURNS TABLE (
    id uuid,
    title text,
    description text,
    icon text,
    delivery_type text,
    content_url text,
    is_unlocked boolean,
    is_purchasable boolean,
    price_cents integer,
    action_label text,
    source_type text
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    -- 1. BONUS PRODUCTS (Unlocked by eligibility or manual assignment)
    SELECT 
        b.id,
        b.name as title,
        b.description,
        COALESCE(b.icon, '🎁') as icon,
        b.delivery_type,
        b.content_url,
        true as is_unlocked, -- Simplification: assume active bonuses are visible/unlocked for now, or add logic
        false as is_purchasable,
        0 as price_cents,
        'ACCEDI' as action_label,
        'bonus' as source_type
    FROM bonus_products b
    WHERE b.active = true
    
    UNION ALL

    -- 2. UPSELL PRODUCTS (Purchasable extras)
    SELECT 
        u.id,
        u.name as title,
        u.description,
        COALESCE(u.icon, '💎') as icon,
        'locked' as delivery_type,
        '' as content_url,
        EXISTS (
            SELECT 1 FROM purchases p 
            WHERE p.user_id = p_user_id 
            AND p.course_id = u.id::text -- Assuming upsells are treated as courses in purchases or separate?
            AND p.status = 'active'
        ) as is_unlocked,
        true as is_purchasable,
        u.price as price_cents,
        'SBLOCCA ORA' as action_label,
        'upsell' as source_type
    FROM upsell_products u
    WHERE u.active = true;
END;
$$;
