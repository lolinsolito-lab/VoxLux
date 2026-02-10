-- =====================================================
-- FIX BONUS SYSTEM COMPLETE (Data + RPC)
-- =====================================================

-- 1. POPOLA TABELLA bonus_content (Seeding)
-- Puliamo per evitare duplicati vecchi
DELETE FROM public.bonus_content WHERE title IN (
    'Template Storytelling Esclusivi',
    '10 Script AI Podcast',
    'Sessione 1-on-1 VIP'
);

INSERT INTO public.bonus_content (
    title, 
    description, 
    icon, 
    is_purchasable, 
    price_cents, 
    delivery_type, 
    content_url, 
    action_label, 
    is_global_bonus, 
    order_index,
    is_visible
)
VALUES 
(
    'Template Storytelling Esclusivi',
    'Raccolta di 20 template pronti all''uso per storytelling efficace. Include strutture per email, post social e video sales letter.',
    '📝',
    true,
    4700, -- €47.00
    'download',
    'https://r2.voxlux.com/bonuses/storytelling-templates.pdf',
    'SCARICA',
    false,
    1,
    true
),
(
    '10 Script AI Podcast',
    'Script ottimizzati per podcast creati con AI. Prompt e strutture per episodi che trattengono l''ascoltatore fino all''ultimo secondo.',
    '🤖',
    true,
    3700, -- €37.00
    'download',
    'https://r2.voxlux.com/bonuses/ai-podcast-scripts.pdf',
    'SCARICA',
    false,
    2,
    true
),
(
    'Sessione 1-on-1 VIP',
    'Sessione privata di 60 minuti con il founder per analisi strategica del brand e della voce.',
    '💎',
    true,
    19700, -- €197.00
    'link',
    'https://calendly.com/voxlux/vip-session',
    'PRENOTA',
    false,
    3,
    true
);


-- 2. AGGIORNA RPC (Assicura che legga la tabella GIUSTA)
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

-- Grant permissions just in case
GRANT EXECUTE ON FUNCTION public.get_user_bonuses(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_bonuses(UUID) TO service_role;
