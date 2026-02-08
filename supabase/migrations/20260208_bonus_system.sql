-- BONUS SYSTEM MIGRATION

-- Table for Bonus Content Definitions
CREATE TABLE IF NOT EXISTS public.bonus_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT '🎁',
    
    -- Access Logic (OR logic)
    required_course_id TEXT, -- Es. 'matrice-1' (chi ha Matrice 1 lo vede)
    stripe_product_id TEXT, -- Es. 'prod_xyz' (chi ha comprato questo extra lo vede)
    is_global_bonus BOOLEAN DEFAULT false, -- Se true, tutti lo vedono (es. freebie)
    
    -- Content Logic
    delivery_type TEXT DEFAULT 'video', -- 'video', 'link', 'download'
    content_url TEXT, -- Link diretto risorsa
    action_label TEXT DEFAULT 'ACCEDI',
    
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Bonus Content
ALTER TABLE public.bonus_content ENABLE ROW LEVEL SECURITY;

-- Reading: Everyone can read definitions (filtering happens in frontend or API for simplicity, 
-- but strictly we could filter here. For now, let's allow read to Authenticated to show "Locked" state if needed, 
-- or just filter visible ones)
CREATE POLICY "Authenticated can read bonus definitions" 
ON public.bonus_content FOR SELECT 
TO authenticated 
USING (true);

-- Admin Write Access
CREATE POLICY "Admins full access bonus_content" 
ON public.bonus_content FOR ALL 
TO authenticated 
USING (is_admin());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bonus_course_id ON public.bonus_content(required_course_id);
