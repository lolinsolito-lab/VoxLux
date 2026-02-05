-- VOX LUX STRATEGY - Production Database Schema
-- Version: 2.0 (Production)
-- Last Updated: 2026-02-05

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES (Already exist, included for reference)
-- ============================================

-- User Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NEW: ADMIN AUTHENTICATION
-- ============================================

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, -- Separate from regular users
  full_name TEXT,
  role TEXT DEFAULT 'admin', -- 'super_admin', 'admin', 'support'
  permissions JSONB DEFAULT '["read", "write"]',
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin sessions for JWT
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PURCHASES (Updated)
-- ============================================

-- Drop existing if upgrading
DROP TABLE IF EXISTS purchases CASCADE;

CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- NULL until signup
  email TEXT NOT NULL, -- Stored before signup
  course_id TEXT NOT NULL, -- 'matrice-1', 'matrice-2', 'ascension-box'
  stripe_payment_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'eur',
  status TEXT DEFAULT 'pending_registration', -- 'pending_registration', 'active', 'refunded', 'cancelled'
  
  -- Bonus tracking
  bonus_eligible BOOLEAN DEFAULT false,
  bonus_granted BOOLEAN DEFAULT false,
  bonus_expires_at TIMESTAMPTZ, -- 24h from purchase
  
  -- Upsells purchased
  upsells JSONB DEFAULT '[]', -- [{upsell_id, amount, name}]
  
  -- Timestamps
  purchase_timestamp TIMESTAMPTZ DEFAULT NOW(),
  activated_at TIMESTAMPTZ, -- When user signed up
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for email lookup (before signup)
CREATE INDEX idx_purchases_email ON purchases(email) WHERE user_id IS NULL;
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_status ON purchases(status);

-- ============================================
-- BONUS PRODUCTS
-- ============================================

CREATE TABLE bonus_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  tier_applicable TEXT[], -- ['matrice-1', 'matrice-2', 'ascension-box']
  eligibility_hours INTEGER DEFAULT 24, -- Hours window for eligibility
  
  -- Content delivery (flexible)
  delivery_type TEXT NOT NULL, -- 'supabase_storage', 'external_url', 'youtube', 'vimeo', 'download_link'
  content_url TEXT, -- Supabase Storage path or external URL
  metadata JSONB, -- {file_size, duration, format, etc.}
  
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User bonus grants
CREATE TABLE user_bonuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  bonus_id UUID REFERENCES bonus_products(id) ON DELETE CASCADE,
  purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  accessed_at TIMESTAMPTZ, -- When user first accessed the bonus
  UNIQUE(user_id, bonus_id)
);

-- ============================================
-- UPSELL PRODUCTS
-- ============================================

CREATE TABLE upsell_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- in cents
  stripe_price_id TEXT, -- Stripe Price ID
  
  -- Display options
  display_order INTEGER DEFAULT 0,
  badge TEXT, -- 'POPULAR', 'LIMITED TIME', etc.
  
  -- Availability
  active BOOLEAN DEFAULT true,
  available_for_tiers TEXT[], -- Which tiers can see this upsell
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROMO CODES (Custom System)
-- ============================================

CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL, -- e.g. 'LAUNCH50'
  description TEXT,
  
  -- Discount config
  discount_type TEXT NOT NULL, -- 'percentage', 'fixed_amount'
  discount_value INTEGER NOT NULL, -- 50 (for 50%) or 5000 (for €50)
  
  -- Applicability
  applicable_tiers TEXT[], -- NULL = all tiers
  min_purchase_amount INTEGER, -- Minimum cart value
  max_uses INTEGER, -- NULL = unlimited
  uses_count INTEGER DEFAULT 0,
  
  -- Validity
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  
  -- Created by admin
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promo code usage tracking
CREATE TABLE promo_code_uses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promo_code_id UUID REFERENCES promo_codes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
  discount_applied INTEGER, -- Amount saved in cents
  used_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TERMS & CONDITIONS TRACKING
-- ============================================

CREATE TABLE tc_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  version TEXT UNIQUE NOT NULL, -- 'v1.0', 'v1.1', etc.
  content TEXT NOT NULL, -- Full T&C text
  effective_date TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tc_acceptances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tc_version_id UUID REFERENCES tc_versions(id),
  accepted_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  UNIQUE(user_id, tc_version_id)
);

-- ============================================
-- COURSE PROGRESS (Already exists, included for reference)
-- ============================================

CREATE TABLE IF NOT EXISTS course_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  mastermind_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id, mastermind_id)
);

-- ============================================
-- ANALYTICS EVENTS (For Custom Dashboard)
-- ============================================

CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL, -- 'page_view', 'checkout_started', 'purchase_completed', etc.
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  
  -- Event data
  properties JSONB, -- {page, tier, utm_source, etc.}
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonus_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE upsell_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_code_uses ENABLE ROW LEVEL SECURITY;
ALTER TABLE tc_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tc_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Admin tables (no RLS, protected by separate auth)
-- admin_users, admin_sessions

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own purchases" ON purchases;
DROP POLICY IF EXISTS "Users can view active bonuses" ON bonus_products;
DROP POLICY IF EXISTS "Users can view own granted bonuses" ON user_bonuses;
DROP POLICY IF EXISTS "Public can view active upsells" ON upsell_products;
DROP POLICY IF EXISTS "Public can view active promo codes" ON promo_codes;
DROP POLICY IF EXISTS "Public can view current T&C" ON tc_versions;
DROP POLICY IF EXISTS "Users can view own T&C acceptances" ON tc_acceptances;
DROP POLICY IF EXISTS "Users can insert own T&C acceptance" ON tc_acceptances;
DROP POLICY IF EXISTS "Users can manage own progress" ON course_progress;
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON analytics_events;

-- Profiles: Users can read/update their own
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Purchases: Users can view their own
CREATE POLICY "Users can view own purchases" ON purchases
  FOR SELECT USING (auth.uid() = user_id);

-- Bonuses: Users can view active bonuses for their tiers
CREATE POLICY "Users can view active bonuses" ON bonus_products
  FOR SELECT USING (active = true);

CREATE POLICY "Users can view own granted bonuses" ON user_bonuses
  FOR SELECT USING (auth.uid() = user_id);

-- Upsells: Public can view active upsells
CREATE POLICY "Public can view active upsells" ON upsell_products
  FOR SELECT USING (active = true);

-- Promo codes: Read-only for validation
CREATE POLICY "Public can view active promo codes" ON promo_codes
  FOR SELECT USING (active = true AND valid_until > NOW());

-- T&C: Public can read current version
CREATE POLICY "Public can view current T&C" ON tc_versions
  FOR SELECT USING (effective_date <= NOW());

CREATE POLICY "Users can view own T&C acceptances" ON tc_acceptances
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own T&C acceptance" ON tc_acceptances
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Course progress: Users can manage their own
CREATE POLICY "Users can manage own progress" ON course_progress
  FOR ALL USING (auth.uid() = user_id);

-- Analytics: Insert only (no read for users)
CREATE POLICY "Anyone can insert analytics events" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON purchases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bonus_products_updated_at BEFORE UPDATE ON bonus_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_upsell_products_updated_at BEFORE UPDATE ON upsell_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (Initial Setup)
-- ============================================

-- Insert default T&C version
INSERT INTO tc_versions (version, content, effective_date) VALUES
('v1.0', 'Terms and Conditions content will be updated by admin.', NOW())
ON CONFLICT DO NOTHING;

-- Insert initial bonus products (examples)
INSERT INTO bonus_products (name, description, tier_applicable, delivery_type, content_url) VALUES
('Template Storytelling Esclusivi', 'Raccolta di 20 template pronti all''uso per storytelling efficace', ARRAY['matrice-1', 'ascension-box'], 'supabase_storage', '/bonuses/storytelling-templates.pdf'),
('10 Script AI Podcast', 'Script ottimizzati per podcast creati con AI', ARRAY['matrice-2', 'ascension-box'], 'supabase_storage', '/bonuses/podcast-scripts.pdf'),
('Sessione 1-on-1 VIP', 'Sessione privata di 60 minuti con il founder', ARRAY['ascension-box'], 'external_url', 'https://calendly.com/voxlux/vip-session')
ON CONFLICT DO NOTHING;

-- Insert initial upsell products
INSERT INTO upsell_products (name, description, price, display_order, badge, available_for_tiers) VALUES
('1-on-1 Coaching Session', 'Sessione personalizzata di coaching (60 min)', 19700, 1, 'POPULAR', ARRAY['matrice-1', 'matrice-2', 'ascension-box']),
('Masterclass Esclusiva', 'Accesso a masterclass avanzate', 9700, 2, 'LIMITED TIME', ARRAY['matrice-1', 'matrice-2']),
('Certification Fast-Track', 'Percorso accelerato per certificazione', 14700, 3, NULL, ARRAY['ascension-box'])
ON CONFLICT DO NOTHING;

-- ============================================
-- ADMIN HELPER VIEWS
-- ============================================

-- Revenue overview
CREATE OR REPLACE VIEW admin_revenue_overview AS
SELECT
  DATE_TRUNC('day', purchase_timestamp) AS date,
  course_id,
  COUNT(*) AS purchases,
  SUM(amount) AS revenue_cents,
  SUM(amount) / 100.0 AS revenue_eur
FROM purchases
WHERE status = 'active'
GROUP BY DATE_TRUNC('day', purchase_timestamp), course_id
ORDER BY date DESC;

-- User stats
CREATE OR REPLACE VIEW admin_user_stats AS
SELECT
  COUNT(DISTINCT p.id) AS total_users,
  COUNT(DISTINCT CASE WHEN pu.status = 'active' THEN p.id END) AS paying_users,
  COUNT(DISTINCT CASE WHEN p.created_at > NOW() - INTERVAL '7 days' THEN p.id END) AS new_users_7d,
  COUNT(DISTINCT CASE WHEN p.created_at > NOW() - INTERVAL '30 days' THEN p.id END) AS new_users_30d
FROM profiles p
LEFT JOIN purchases pu ON p.id = pu.user_id;
