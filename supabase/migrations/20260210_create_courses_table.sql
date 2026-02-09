-- 20260210_create_courses_table.sql
-- FIX: Create missing 'courses' table required by LMS and Dashboard

CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    tier_required TEXT[] DEFAULT '{}', -- e.g. ['matrice_1', 'ascension_box']
    status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
    duration_hours INTEGER DEFAULT 0,
    color_theme JSONB DEFAULT '{"primary": "#000000", "secondary": "#ffffff"}',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Public Read (Authenticated & Anon)
CREATE POLICY "Public read courses"
ON public.courses FOR SELECT
TO authenticated, anon
USING (status = 'published');

-- 2. Admin Full Access
CREATE POLICY "Admins full access courses"
ON public.courses FOR ALL
TO authenticated
USING (is_admin());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_tier ON public.courses USING GIN(tier_required);
