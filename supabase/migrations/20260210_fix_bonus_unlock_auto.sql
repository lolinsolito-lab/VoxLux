-- ═══════════════════════════════════════════════════════════════
-- 🔧 FIX: get_user_bonuses - Auto-unlock by Course Ownership
-- ═══════════════════════════════════════════════════════════════

DROP FUNCTION IF EXISTS public.get_user_bonuses(UUID);

CREATE OR REPLACE FUNCTION public.get_user_bonuses(p_user_id UUID)
RETURNS TABLE (
    id UUID,
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
            -- Global bonuses (always unlocked)
            WHEN bc.is_global_bonus = true THEN true
            
            -- Manual grants via user_bonus_access
            WHEN uba.user_id IS NOT NULL THEN true
            
            -- ✅ AUTO-UNLOCK: User owns the required course
            WHEN bc.required_course_id IS NOT NULL 
                 AND EXISTS (
                     SELECT 1 FROM public.purchases p 
                     WHERE p.user_id = p_user_id 
                     AND p.course_id = bc.required_course_id 
                     AND p.status = 'active'
                 ) THEN true
            
            -- Otherwise locked
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_user_bonuses(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_bonuses(UUID) TO service_role;

COMMENT ON FUNCTION public.get_user_bonuses IS 
'Returns all visible bonuses with unlock status. Auto-unlocks bonuses when user owns required_course_id.';
