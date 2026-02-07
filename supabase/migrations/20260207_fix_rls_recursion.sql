-- FIX: Infinite Recursion in Profiles RLS Policy
-- The admin policy was using a subquery on profiles while reading profiles, causing recursion.
-- Solution: Use a SQL function with SECURITY DEFINER to bypass RLS during role check.

-- 1. Create a helper function to check if user is admin (bypasses RLS)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'god')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the recursive policies
DROP POLICY IF EXISTS "Admins can do everything on profiles" ON profiles;
DROP POLICY IF EXISTS "Admins see all purchases" ON purchases;
DROP POLICY IF EXISTS "Admins manage bonuses" ON bonus_products;
DROP POLICY IF EXISTS "Admins see all stats" ON user_stats;

-- 3. Recreate policies using the helper function (no recursion)
CREATE POLICY "Admins can do everything on profiles" 
ON profiles FOR ALL TO authenticated 
USING (is_admin());

CREATE POLICY "Admins see all purchases" 
ON purchases FOR ALL TO authenticated 
USING (is_admin());

CREATE POLICY "Admins manage bonuses" 
ON bonus_products FOR ALL TO authenticated 
USING (is_admin());

CREATE POLICY "Admins see all stats" 
ON user_stats FOR ALL TO authenticated 
USING (is_admin());

-- 4. Also fix upsell_products and promo_codes
-- Enable RLS if not already
ALTER TABLE upsell_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Drop old policies if exist
DROP POLICY IF EXISTS "Everyone see upsells" ON upsell_products;
DROP POLICY IF EXISTS "Admins manage upsells" ON upsell_products;
DROP POLICY IF EXISTS "Everyone see promos" ON promo_codes;
DROP POLICY IF EXISTS "Admins manage promos" ON promo_codes;

-- Create new policies
CREATE POLICY "Everyone see upsells" 
ON upsell_products FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins manage upsells" 
ON upsell_products FOR ALL TO authenticated 
USING (is_admin());

CREATE POLICY "Everyone see promos" 
ON promo_codes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins manage promos" 
ON promo_codes FOR ALL TO authenticated 
USING (is_admin());
