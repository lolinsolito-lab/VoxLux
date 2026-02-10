-- FIX USER STATS COMPLETE MIGRATION
-- This script does 2 things:
-- 1. Ensures `user_module_progress` exists (referencing LMS schema)
-- 2. Creates the missing `user_stats` VIEW that calculates Level/XP

-- =====================================================
-- 1. Ensure `user_module_progress` exists
-- =====================================================
CREATE TABLE IF NOT EXISTS user_module_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    time_spent_seconds INTEGER DEFAULT 0,
    quiz_score INTEGER,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_module UNIQUE (user_id, module_id)
);

-- Indexes (if they don't exist, we just attempt specific names or rely on IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_module_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_progress_module ON user_module_progress (module_id);
CREATE INDEX IF NOT EXISTS idx_progress_course ON user_module_progress (course_id);

-- Enable RLS
ALTER TABLE user_module_progress ENABLE ROW LEVEL SECURITY;

-- Policies (Drop first to avoid errors if they exist)
DROP POLICY IF EXISTS "Users can view their own progress" ON user_module_progress;
DROP POLICY IF EXISTS "Users can manage their own progress" ON user_module_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_module_progress;
DROP POLICY IF EXISTS "Admins can view all progress" ON user_module_progress;

CREATE POLICY "Users can view their own progress"
ON user_module_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own progress"
ON user_module_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON user_module_progress FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress"
ON user_module_progress FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- =====================================================
-- 2. Create `user_stats` VIEW
-- =====================================================
-- This view aggregates XP from completed modules

-- !!! IMPORTANT !!!
-- We drop the TABLE first because it might exist as a static table from old migrations.
-- We want a dynamic VIEW instead.
DROP TABLE IF EXISTS user_stats CASCADE;
DROP VIEW IF EXISTS user_stats;

CREATE OR REPLACE VIEW user_stats AS
SELECT 
    p.id as user_id,
    -- Logic for Level Name based on Total XP
    CASE 
        WHEN COALESCE(SUM(cm.xp_reward), 0) < 100 THEN 'Novizio'
        WHEN COALESCE(SUM(cm.xp_reward), 0) < 500 THEN 'Apprendista'
        WHEN COALESCE(SUM(cm.xp_reward), 0) < 1000 THEN 'Narratore'
        WHEN COALESCE(SUM(cm.xp_reward), 0) < 2500 THEN 'Stratega'
        ELSE 'Maestro'
    END as level_name,
    COALESCE(SUM(cm.xp_reward), 0) as total_xp,
    COUNT(DISTINCT ump.course_id) as courses_in_progress,
    COUNT(DISTINCT CASE WHEN ump.status = 'completed' THEN ump.module_id END) as modules_completed
FROM profiles p
LEFT JOIN user_module_progress ump ON p.id = ump.user_id AND ump.status = 'completed'
LEFT JOIN course_modules cm ON ump.module_id = cm.id
GROUP BY p.id;

-- Grant permissions on the view
GRANT SELECT ON user_stats TO authenticated;
GRANT SELECT ON user_stats TO anon; -- If public profiles need it, otherwise restrict
