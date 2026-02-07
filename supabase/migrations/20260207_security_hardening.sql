-- SECURITY HARDENING MIGRATION
-- 1. Create User Roles
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin', 'god');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Add Role to Profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user'::user_role;

-- 3. Enable RLS on All Tables (Just to be sure)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonus_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE tc_acceptances ENABLE ROW LEVEL SECURITY;

-- 4. PROFILES POLICIES
-- Drop existing to avoid conflicts
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can do everything on profiles" ON profiles;

-- Public Read (Needed for potential public profiles, but strictly restrict PII in Select)
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT TO authenticated, anon USING (true);

-- User Update Own Profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE TO authenticated 
USING (auth.uid() = id);

-- ADMIN/GOD POLICY (THE KEY)
CREATE POLICY "Admins can do everything on profiles" 
ON profiles FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'god')));


-- 5. PURCHASES POLICIES
DROP POLICY IF EXISTS "Users see own purchases" ON purchases;
DROP POLICY IF EXISTS "Admins see all purchases" ON purchases;

-- Users see own purchases
CREATE POLICY "Users see own purchases" 
ON purchases FOR SELECT TO authenticated 
USING (auth.uid() = (SELECT id FROM profiles WHERE email = purchases.email)); 

-- Admin see all purchases
CREATE POLICY "Admins see all purchases" 
ON purchases FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'god')));


-- 6. BONUS PRODUCTS POLICIES
DROP POLICY IF EXISTS "Everyone see bonuses" ON bonus_products;
DROP POLICY IF EXISTS "Admins manage bonuses" ON bonus_products;

-- Everyone can see available bonuses
CREATE POLICY "Everyone see bonuses" 
ON bonus_products FOR SELECT TO authenticated USING (true);

-- Only Admins can manage bonuses
CREATE POLICY "Admins manage bonuses" 
ON bonus_products FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'god')));

-- 7. USER STATS POLICIES
DROP POLICY IF EXISTS "Users see own stats" ON user_stats;
DROP POLICY IF EXISTS "Admins see all stats" ON user_stats;

CREATE POLICY "Users see own stats" 
ON user_stats FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins see all stats" 
ON user_stats FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'god')));
