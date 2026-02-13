-- RESTORE USER_STATS TABLE
-- This script ensures user_stats is a real TABLE (not a view) and populates it.

-- 1. Drop View/Table to ensure clean state
DROP VIEW IF EXISTS public.user_stats;
-- We use IF NOT EXISTS for the table creation, but if it was a view, we dropped it above.

-- 2. Create Table (matches supabase_schema.sql)
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 0,
  level_name TEXT DEFAULT 'Novizio',
  completed_masterminds INTEGER DEFAULT 0,
  completed_modules INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- 4. Policies
DROP POLICY IF EXISTS "Users can view own stats" ON public.user_stats;
CREATE POLICY "Users can view own stats" ON public.user_stats FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;
CREATE POLICY "Users can update own stats" ON public.user_stats FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service Role manages stats" ON public.user_stats;
CREATE POLICY "Service Role manages stats" ON public.user_stats FOR ALL USING (auth.role() = 'service_role');

-- 5. Backfill Data
INSERT INTO public.user_stats (user_id, total_xp, current_level, level_name)
SELECT 
    id, 
    0, 
    0, 
    'Novizio'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_stats)
ON CONFLICT (user_id) DO NOTHING;
