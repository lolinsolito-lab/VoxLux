-- POLICY FOR PURCHASES (Admin Finance)
-- Ensure Admin can DELETE test transactions

-- Drop potential conflicting policies
DROP POLICY IF EXISTS "Admin Full Access Purchases" ON public.purchases;

-- Create Admin Policy
-- Uses current_setting as safest fallback for getting email from JWT
CREATE POLICY "Admin Full Access Purchases" ON public.purchases
FOR ALL TO authenticated
USING (
    (current_setting('request.jwt.claims', true)::jsonb ->> 'email') ILIKE '%@voxlux.strategy' 
    OR (current_setting('request.jwt.claims', true)::jsonb ->> 'email') = 'michael@voxlux.strategy'
    OR (current_setting('request.jwt.claims', true)::jsonb ->> 'email') = 'admin@insolito.dev'
    OR (current_setting('request.jwt.claims', true)::jsonb ->> 'email') = 'jaramichael@hotmail.com'
);
