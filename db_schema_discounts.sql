-- PROMO CODES SCHEMA
-- Supports percentage and fixed amount discounts, validity periods, max uses, and tier restrictions

CREATE TABLE IF NOT EXISTS public.promo_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value INTEGER NOT NULL, -- Percentage (1-100) or Cents (e.g. 1000 = 10.00 EUR)
    applicable_tiers TEXT[] DEFAULT NULL, -- NULL = All tiers, or array ['matrice-1', 'ascension-box']
    min_purchase_amount INTEGER DEFAULT NULL, -- In cents
    max_uses INTEGER DEFAULT NULL,
    uses_count INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ DEFAULT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup during checkout
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON public.promo_codes(code);

-- TRACK REDEMPTIONS (Who used what)
CREATE TABLE IF NOT EXISTS public.promo_code_redemptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    promo_code_id UUID REFERENCES public.promo_codes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id TEXT, -- Optional link to Stripe or Purchases table
    details JSONB DEFAULT '{}', -- Snapshot of discount applied
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_code_redemptions ENABLE ROW LEVEL SECURITY;

-- ADMIN: Full Access
CREATE POLICY "Admin Full Access Promo" ON public.promo_codes
FOR ALL TO authenticated
USING (
    (current_setting('request.jwt.claims', true)::jsonb ->> 'email') ILIKE '%@voxlux.strategy' 
    OR (current_setting('request.jwt.claims', true)::jsonb ->> 'email') = 'michael@voxlux.strategy'
    OR (current_setting('request.jwt.claims', true)::jsonb ->> 'email') = 'admin@insolito.dev'
    OR (current_setting('request.jwt.claims', true)::jsonb ->> 'email') = 'jaramichael@hotmail.com'
);

CREATE POLICY "Admin View Redemptions" ON public.promo_code_redemptions
FOR SELECT TO authenticated
USING (
    (current_setting('request.jwt.claims', true)::jsonb ->> 'email') ILIKE '%@voxlux.strategy' 
    OR (current_setting('request.jwt.claims', true)::jsonb ->> 'email') = 'michael@voxlux.strategy'
    OR (current_setting('request.jwt.claims', true)::jsonb ->> 'email') = 'admin@insolito.dev'
    OR (current_setting('request.jwt.claims', true)::jsonb ->> 'email') = 'jaramichael@hotmail.com'
);

-- PUBLIC/USERS: Read Only (for validation during checkout)
-- NOTE: We might want a secure RPC for validation instead of direct read to hide rules.
-- For now, allow read of ACTIVE codes only.
CREATE POLICY "Public Read Active Promo" ON public.promo_codes
FOR SELECT TO authenticated
USING (active = true);

-- TRIGGER TO UPDATE USES COUNT
CREATE OR REPLACE FUNCTION update_promo_uses_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.promo_codes
  SET uses_count = uses_count + 1
  WHERE id = NEW.promo_code_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_promo_uses
AFTER INSERT ON public.promo_code_redemptions
FOR EACH ROW
EXECUTE FUNCTION update_promo_uses_count();
