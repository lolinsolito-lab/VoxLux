-- LEGALE BLINDATO & LMS EVOLUTO MIGRATION

-- 1. USER CONTRACTS (Blindatura Legale)
CREATE TABLE IF NOT EXISTS public.user_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    contract_version TEXT NOT NULL, -- es. 'v1_2026'
    signed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    agreements JSONB NOT NULL DEFAULT '{}'::jsonb, -- { "refund_waiver": true, "privacy": true, "anti_piracy": true }
    pdf_url TEXT, -- Link al PDF generato nello storage (opzionale)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for user_contracts
ALTER TABLE public.user_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own contracts" 
ON public.user_contracts FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can sign contracts" 
ON public.user_contracts FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Admin viewing policy (using is_admin function created previously)
CREATE POLICY "Admins can view all contracts" 
ON public.user_contracts FOR ALL 
TO authenticated 
USING (is_admin());


-- 2. LMS TABLES (Modules & Lessons)

-- MODULES
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id TEXT NOT NULL, -- 'matrice-1', 'matrice-2', 'ascension-box' (o altri futuri)
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- LESSONS
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    video_provider TEXT DEFAULT 'youtube', -- 'youtube', 'vimeo', 'custom'
    video_id TEXT, -- ID del video sulla piattaforma
    duration_minutes INTEGER DEFAULT 0,
    order_index INTEGER NOT NULL DEFAULT 0,
    resources JSONB DEFAULT '[]'::jsonb, -- Array di link/pdf { "title": "PDF", "url": "..." }
    is_free_preview BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- USER PROGRESS
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
    completed BOOLEAN DEFAULT false,
    last_position_seconds INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, lesson_id)
);


-- RLS for LMS
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Public Read Access for Modules & Lessons (Content structure is public/semi-public)
CREATE POLICY "Public read modules" 
ON public.modules FOR SELECT 
TO authenticated, anon 
USING (true);

CREATE POLICY "Public read lessons" 
ON public.lessons FOR SELECT 
TO authenticated, anon 
USING (true);

-- Admin Write Access
CREATE POLICY "Admins full access modules" 
ON public.modules FOR ALL 
TO authenticated 
USING (is_admin());

CREATE POLICY "Admins full access lessons" 
ON public.lessons FOR ALL 
TO authenticated 
USING (is_admin());

-- User Progress Policies
CREATE POLICY "Users view own progress" 
ON public.user_progress FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users update own progress" 
ON public.user_progress FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users modify own progress" 
ON public.user_progress FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Admins view user progress" 
ON public.user_progress FOR SELECT 
TO authenticated 
USING (is_admin());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON public.modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON public.user_progress(user_id);
