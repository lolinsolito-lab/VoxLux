-- ═══════════════════════════════════════════════════════════════
-- 🔧 FIX: get_user_bonuses - Correct Column Alias
-- Migration: 20260209_bonus_evolution_fix.sql
-- ═══════════════════════════════════════════════════════════════

-- Drop and recreate with correct column alias
DROP FUNCTION IF EXISTS public.get_user_bonuses(UUID);

CREATE OR REPLACE FUNCTION public.get_user_bonuses(p_user_id UUID)
RETURNS TABLE (
    id UUID,  -- Changed from bonus_id to id for consistency
    title TEXT,
    description TEXT,
    icon TEXT,
    delivery_type TEXT,
    content_url TEXT,
    action_label TEXT,
    is_unlocked BOOLEAN,
    is_purchasable BOOLEAN,
    price_cents INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bc.id,
        bc.title,
        bc.description,
        bc.icon,
        bc.delivery_type,
        bc.content_url,
        bc.action_label,
        CASE 
            WHEN bc.is_global_bonus = true THEN true
            WHEN uba.user_id IS NOT NULL THEN true
            ELSE false
        END as is_unlocked,
        bc.is_purchasable,
        bc.price_cents
    FROM public.bonus_content bc
    LEFT JOIN public.user_bonus_access uba 
        ON uba.bonus_id = bc.id 
        AND uba.user_id = p_user_id
    WHERE bc.is_visible = true
    ORDER BY 
        CASE WHEN bc.is_purchasable = false THEN 0 ELSE 1 END,
        bc.order_index;
END;
$$;

COMMENT ON FUNCTION public.get_user_bonuses IS 'Returns all visible bonuses with unlock status for a user';
