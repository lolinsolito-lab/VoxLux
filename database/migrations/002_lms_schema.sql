-- =====================================================
-- VOX LUX - LMS Database Schema Migration
-- Phase 2: Course Management System
-- =====================================================
-- 
-- WHAT THIS DOES:
-- Creates 3 new tables for dynamic course management:
-- 1. courses - Course metadata (Matrice 1, 2, Box)
-- 2. course_modules - Individual lessons/modules
-- 3. user_module_progress - Track user completion
--
-- SAFE TO RUN: Yes - creates NEW tables, doesn't modify existing ones
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE 1: courses
-- =====================================================
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    tier_required TEXT[] NOT NULL DEFAULT '{}', -- ['matrice_1', 'matrice_2', 'ascension_box']
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    thumbnail_url TEXT,
    duration_hours INTEGER DEFAULT 0,
    color_theme JSONB DEFAULT '{"primary": "#8B5CF6", "secondary": "#EC4899"}'::jsonb,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_tier ON courses USING GIN (tier_required);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses (status);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses (slug);

-- Comment for clarity
COMMENT ON TABLE courses IS 'Stores course metadata for Matrice 1, Matrice 2, and Ascension Box';
COMMENT ON COLUMN courses.tier_required IS 'Array of tiers this course is available for';
COMMENT ON COLUMN courses.color_theme IS 'JSON object with primary and secondary colors for course branding';

-- =====================================================
-- TABLE 2: course_modules
-- =====================================================
CREATE TABLE IF NOT EXISTS course_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    module_order INTEGER NOT NULL DEFAULT 0,
    content_type TEXT DEFAULT 'lesson' CHECK (content_type IN ('lesson', 'quiz', 'video', 'assignment')),
    content_data JSONB DEFAULT '{}'::jsonb,
    video_url TEXT,
    video_duration INTEGER DEFAULT 0, -- seconds
    unlock_after_hours INTEGER DEFAULT 0,
    is_locked BOOLEAN DEFAULT false,
    xp_reward INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_module_order_per_course UNIQUE (course_id, module_order)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_modules_course ON course_modules (course_id);
CREATE INDEX IF NOT EXISTS idx_modules_order ON course_modules (course_id, module_order);
CREATE INDEX IF NOT EXISTS idx_modules_type ON course_modules (content_type);

-- Comment for clarity
COMMENT ON TABLE course_modules IS 'Individual modules/lessons within courses';
COMMENT ON COLUMN course_modules.content_data IS 'JSONB structure for flexible content: lessons, quizzes, videos, etc.';
COMMENT ON COLUMN course_modules.unlock_after_hours IS 'Hours after enrollment before this module unlocks';

-- =====================================================
-- TABLE 3: user_module_progress
-- =====================================================
CREATE TABLE IF NOT EXISTS user_module_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    time_spent_seconds INTEGER DEFAULT 0,
    quiz_score INTEGER, -- Percentage for quiz modules
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_module UNIQUE (user_id, module_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_module_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_progress_module ON user_module_progress (module_id);
CREATE INDEX IF NOT EXISTS idx_progress_course ON user_module_progress (course_id);
CREATE INDEX IF NOT EXISTS idx_progress_status ON user_module_progress (status);
CREATE INDEX IF NOT EXISTS idx_progress_user_course ON user_module_progress (user_id, course_id);

-- Comment for clarity
COMMENT ON TABLE user_module_progress IS 'Tracks user completion and progress for each module';
COMMENT ON COLUMN user_module_progress.quiz_score IS 'Quiz score as percentage (0-100) for quiz modules';

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_module_progress ENABLE ROW LEVEL SECURITY;

-- Courses: Everyone can read published courses
CREATE POLICY "Anyone can view published courses"
ON courses FOR SELECT
USING (status = 'published');

-- Courses: Admins can do everything
CREATE POLICY "Admins can manage all courses"
ON courses FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Course Modules: Everyone can read modules of published courses
CREATE POLICY "Anyone can view modules of published courses"
ON course_modules FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM courses
        WHERE courses.id = course_modules.course_id
        AND courses.status = 'published'
    )
);

-- Course Modules: Admins can do everything
CREATE POLICY "Admins can manage all modules"
ON course_modules FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- User Progress: Users can view their own progress
CREATE POLICY "Users can view their own progress"
ON user_module_progress FOR SELECT
USING (auth.uid() = user_id);

-- User Progress: Users can insert/update their own progress
CREATE POLICY "Users can manage their own progress"
ON user_module_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON user_module_progress FOR UPDATE
USING (auth.uid() = user_id);

-- User Progress: Admins can view all progress
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
-- HELPER FUNCTIONS
-- =====================================================

-- Function: Calculate course completion percentage for a user
CREATE OR REPLACE FUNCTION calculate_course_completion(
    p_user_id UUID,
    p_course_id UUID
)
RETURNS INTEGER AS $$
DECLARE
    v_total_modules INTEGER;
    v_completed_modules INTEGER;
    v_percentage INTEGER;
BEGIN
    -- Count total modules
    SELECT COUNT(*) INTO v_total_modules
    FROM course_modules
    WHERE course_id = p_course_id;
    
    -- Count completed modules
    SELECT COUNT(*) INTO v_completed_modules
    FROM user_module_progress
    WHERE user_id = p_user_id
      AND course_id = p_course_id
      AND status = 'completed';
    
    -- Calculate percentage
    IF v_total_modules = 0 THEN
        RETURN 0;
    ELSE
        v_percentage := (v_completed_modules * 100) / v_total_modules;
        RETURN v_percentage;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function: Auto-update timestamp on row update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers: Auto-update updated_at on all tables
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at
    BEFORE UPDATE ON course_modules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_module_progress_updated_at
    BEFORE UPDATE ON user_module_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample course (COMMENTED OUT - uncomment to test)
/*
INSERT INTO courses (title, slug, description, tier_required, status, duration_hours)
VALUES (
    'Neuro-Narrative Mastery',
    'neuro-narrative-mastery',
    'Master the art of viral storytelling through neuro-narrative techniques',
    ARRAY['matrice_1', 'matrice_2', 'ascension_box'],
    'draft',
    40
);

-- Insert sample modules (COMMENTED OUT)
INSERT INTO course_modules (course_id, title, module_order, content_type, xp_reward)
SELECT 
    id,
    'Module 1: The Chaos Within',
    1,
    'lesson',
    150
FROM courses
WHERE slug = 'neuro-narrative-mastery';
*/

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if tables were created
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_name IN ('courses', 'course_modules', 'user_module_progress')
ORDER BY table_name;

-- =====================================================
-- ROLLBACK SCRIPT (In case you need to revert)
-- =====================================================
-- UNCOMMENT AND RUN ONLY IF YOU NEED TO REMOVE EVERYTHING
/*
DROP POLICY IF EXISTS "Anyone can view published courses" ON courses;
DROP POLICY IF EXISTS "Admins can manage all courses" ON courses;
DROP POLICY IF EXISTS "Anyone can view modules of published courses" ON course_modules;
DROP POLICY IF EXISTS "Admins can manage all modules" ON course_modules;
DROP POLICY IF EXISTS "Users can view their own progress" ON user_module_progress;
DROP POLICY IF EXISTS "Users can manage their own progress" ON user_module_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_module_progress;
DROP POLICY IF EXISTS "Admins can view all progress" ON user_module_progress;

DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
DROP TRIGGER IF EXISTS update_course_modules_updated_at ON course_modules;
DROP TRIGGER IF EXISTS update_user_module_progress_updated_at ON user_module_progress;

DROP FUNCTION IF EXISTS calculate_course_completion(UUID, UUID);
DROP FUNCTION IF EXISTS update_updated_at_column();

DROP TABLE IF EXISTS user_module_progress CASCADE;
DROP TABLE IF EXISTS course_modules CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
*/

-- =====================================================
-- END OF MIGRATION
-- =====================================================
