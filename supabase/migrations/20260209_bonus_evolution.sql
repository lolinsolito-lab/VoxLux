-- ═══════════════════════════════════════════════════════════════
-- 🚀 BONUS EVOLUTION - Phase 2: Purchasable Extras + Analytics
-- Migration: 20260209_bonus_evolution.sql
-- Descrizione: Aggiunge supporto per Extra a pagamento, analytics, e tracking
-- ═══════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────┐
-- │ 1. ENHANCE bonus_content (Add Pricing + Stats)              │
-- └─────────────────────────────────────────────────────────────┘

ALTER TABLE public.bonus_content 
ADD COLUMN IF NOT EXISTS price_cents INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_purchasable BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS total_revenue_cents BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_sales INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;

COMMENT ON COLUMN public.bonus_content.price_cents IS 'Prezzo in centesimi (es. 9900 = €99.00). 0 = gratis';
COMMENT ON COLUMN public.bonus_content.is_purchasable IS 'Se true, è un Extra a pagamento visibile a tutti ma locked';
COMMENT ON COLUMN public.bonus_content.total_revenue_cents IS 'Revenue totale generata da questo bonus/extra';
COMMENT ON COLUMN public.bonus_content.total_sales IS 'Numero di vendite totali';
COMMENT ON COLUMN public.bonus_content.is_visible IS 'Se false, nascosto dalla Dashboard (soft delete)';

-- ┌─────────────────────────────────────────────────────────────┐
-- │ 2. ENHANCE user_bonus_access (Add Purchase Tracking)        │
-- └─────────────────────────────────────────────────────────────┘

ALTER TABLE public.user_bonus_access
ADD COLUMN IF NOT EXISTS purchase_amount_cents INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS granted_by UUID;

COMMENT ON COLUMN public.user_bonus_access.purchase_amount_cents IS 'Se > 0, bonus acquistato (non gratuito)';
COMMENT ON COLUMN public.user_bonus_access.stripe_session_id IS 'Stripe Checkout Session ID per tracking';
COMMENT ON COLUMN public.user_bonus_access.granted_by IS 'UUID admin che ha assegnato (NULL = acquisto autonomo)';

-- ┌─────────────────────────────────────────────────────────────┐
-- │ 3. CREATE bonus_analytics (Event Tracking)                  │
-- └─────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS public.bonus_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bonus_id UUID NOT NULL REFERENCES public.bonus_content(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL, -- 'view', 'click', 'purchase'
    session_data JSONB, -- Extra metadata (es. user agent, referrer)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.bonus_analytics IS 'Tracking eventi su bonus/extra (views, clicks, purchases)';

-- Indexes per performance
CREATE INDEX IF NOT EXISTS idx_analytics_bonus_id ON public.bonus_analytics(bonus_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.bonus_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.bonus_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.bonus_analytics(created_at DESC);

-- ┌─────────────────────────────────────────────────────────────┐
-- │ 4. RLS POLICIES - bonus_analytics                           │
-- └─────────────────────────────────────────────────────────────┘

ALTER TABLE public.bonus_analytics ENABLE ROW LEVEL SECURITY;

-- Solo admin può vedere analytics
CREATE POLICY "Only admin can view analytics"
ON public.bonus_analytics FOR SELECT
TO authenticated
USING (
    auth.jwt() ->> 'email' = 'jaramichael@hotmail.com'
);

-- Frontend può inserire eventi (per tracking)
CREATE POLICY "Authenticated users can log events"
ON public.bonus_analytics FOR INSERT
TO authenticated
WITH CHECK (
    user_id = auth.uid()
);

-- ┌─────────────────────────────────────────────────────────────┐
-- │ 5. RLS POLICIES UPDATE - bonus_content                      │
-- └─────────────────────────────────────────────────────────────┘

-- Solo admin può modificare bonus (prezzi, visibility, etc)
CREATE POLICY "Only admin can modify bonus content"
ON public.bonus_content FOR UPDATE
TO authenticated
USING (
    auth.jwt() ->> 'email' = 'jaramichael@hotmail.com'
);

-- Solo admin può creare nuovi bonus
CREATE POLICY "Only admin can create bonus content"
ON public.bonus_content FOR INSERT
TO authenticated
WITH CHECK (
    auth.jwt() ->> 'email' = 'jaramichael@hotmail.com'
);

-- Solo admin può eliminare bonus (soft delete consigliato)
CREATE POLICY "Only admin can delete bonus content"
ON public.bonus_content FOR DELETE
TO authenticated
USING (
    auth.jwt() ->> 'email' = 'jaramichael@hotmail.com'
);

-- ┌─────────────────────────────────────────────────────────────┐
-- │ 6. STORED FUNCTION - Increment Stats (Atomic)               │
-- └─────────────────────────────────────────────────────────────┘

CREATE OR REPLACE FUNCTION public.increment_bonus_stats(
    p_bonus_id UUID,
    p_revenue INTEGER
) RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.bonus_content
    SET 
        total_sales = total_sales + 1,
        total_revenue_cents = total_revenue_cents + p_revenue
    WHERE id = p_bonus_id;
END;
$$;

COMMENT ON FUNCTION public.increment_bonus_stats IS 'Incrementa atomicamente sales e revenue per un bonus';

-- ┌─────────────────────────────────────────────────────────────┐
-- │ 7. STORED FUNCTION - Get User Bonuses (Optimized)           │
-- └─────────────────────────────────────────────────────────────┘

CREATE OR REPLACE FUNCTION public.get_user_bonuses(p_user_id UUID)
RETURNS TABLE (
    bonus_id UUID,
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

COMMENT ON FUNCTION public.get_user_bonuses IS 'Ottimizzazione: Fetch tutti bonus con stato locked/unlocked in 1 query';

-- ┌─────────────────────────────────────────────────────────────┐
-- │ 8. MIGRATION DATA - Convert Existing Bonuses                │
-- └─────────────────────────────────────────────────────────────┘

-- I bonus esistenti diventano bonus "gratuiti assegnati globalmente"
-- (mantenimento backward compatibility)

-- Bonus che hanno required_course_id → Assegnazione automatica a chi ha il corso
-- Questo verrà gestito dal frontend, non qui

-- ═══════════════════════════════════════════════════════════════
-- ✅ BONUS EVOLUTION COMPLETATA
-- Deploy questa migration dopo 20260208_security_lockdown.sql
-- ═══════════════════════════════════════════════════════════════
