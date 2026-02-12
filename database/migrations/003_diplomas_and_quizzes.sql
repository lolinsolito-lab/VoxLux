-- =====================================================
-- VOX LUX - LMS Phase 2: Diplomas & Quizzes
-- Migration: 003_diplomas_and_quizzes.sql
-- =====================================================

-- 1. Create table for user diplomas/certificates
CREATE TABLE IF NOT EXISTS user_diplomas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    certificate_code TEXT UNIQUE NOT NULL, -- Short unique code for verification (e.g. LUX-2026-ABCD)
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb, -- Snapshot of course title, user name, etc.
    CONSTRAINT unique_user_course_diploma UNIQUE (user_id, course_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_diplomas_user ON user_diplomas(user_id);
CREATE INDEX IF NOT EXISTS idx_diplomas_code ON user_diplomas(certificate_code);

-- RLS Policies
ALTER TABLE user_diplomas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own diplomas"
    ON user_diplomas FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all diplomas"
    ON user_diplomas FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 2. Add Diploma Configuration to Courses table
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS diploma_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS diploma_template_id TEXT, -- 'standard', 'gold', 'platinum'
ADD COLUMN IF NOT EXISTS passing_score_required INTEGER DEFAULT 80; -- Global passing score for quizzes

-- 3. Add Quiz specific fields to course_modules (if needed beyond JSONB)
-- We strictly use content_data for questions, but let's ensure we have a helper index if we query by quiz type often.
-- (Already covered by existing indexes in 002)

-- Helper Function to generate certificate code
CREATE OR REPLACE FUNCTION generate_certificate_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result TEXT := '';
    i INTEGER := 0;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN 'LUX-' || to_char(now(), 'YYYY') || '-' || result;
END;
$$ LANGUAGE plpgsql;
