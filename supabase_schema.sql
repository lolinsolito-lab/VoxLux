-- =====================================================
-- VOX LUX STRATEGY - SUPABASE DATABASE SCHEMA
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE
-- Stores user profile information
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- =====================================================
-- 2. PURCHASES TABLE
-- Tracks course purchases via Stripe
-- =====================================================
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL, -- 'matrice-1', 'matrice-2', 'ascension-box'
  stripe_payment_id TEXT UNIQUE,
  status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for purchases
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = user_id);

-- =====================================================
-- 3. COURSE_PROGRESS TABLE
-- Tracks individual module completions
-- =====================================================
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  mastermind_id TEXT NOT NULL, -- 'm1-1', 'm1-2', etc.
  module_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER DEFAULT 0,
  UNIQUE(user_id, module_id)
);

-- RLS Policies for course_progress
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON course_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON course_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON course_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- 4. USER_STATS TABLE
-- Aggregated stats for gamification
-- =====================================================
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 0,
  level_name TEXT DEFAULT 'Novizio',
  completed_masterminds INTEGER DEFAULT 0,
  completed_modules INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for user_stats
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stats"
  ON user_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON user_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- 5. ACHIEVED_DIPLOMAS TABLE
-- Stores completed diplomas (NFT metadata)
-- =====================================================
CREATE TABLE IF NOT EXISTS achieved_diplomas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  quiz_score INTEGER NOT NULL,
  diploma_url TEXT, -- Link to generated diploma image/video
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- RLS Policies for achieved_diplomas
ALTER TABLE achieved_diplomas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own diplomas"
  ON achieved_diplomas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diplomas"
  ON achieved_diplomas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 6. FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update user level based on XP
CREATE OR REPLACE FUNCTION public.update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.current_level := FLOOR(NEW.completed_masterminds);
  
  NEW.level_name := CASE
    WHEN NEW.current_level = 0 THEN 'Novizio'
    WHEN NEW.current_level BETWEEN 1 AND 2 THEN 'Acolyte'
    WHEN NEW.current_level BETWEEN 3 AND 5 THEN 'Adept'
    WHEN NEW.current_level BETWEEN 6 AND 8 THEN 'Master'
    WHEN NEW.current_level = 9 THEN 'Sage'
    WHEN NEW.current_level >= 10 THEN 'Ascended'
    ELSE 'Novizio'
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update level
DROP TRIGGER IF EXISTS calculate_level ON user_stats;
CREATE TRIGGER calculate_level
  BEFORE UPDATE ON user_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_user_level();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_module_id ON course_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_diplomas_user_id ON achieved_diplomas(user_id);
