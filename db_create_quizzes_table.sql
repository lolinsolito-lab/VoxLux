-- ═══════════════════════════════════════════════════════════════
-- 🎓 CREAZIONE TABELLA QUIZ (Phase 2.2)
-- ═══════════════════════════════════════════════════════════════

-- 1. Create QUIZZES table
-- Linked to a MODULE (World) to verify knowledge before progression
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Verifica delle Conoscenze',
    description TEXT,
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    passing_score INTEGER DEFAULT 80, -- Percentuale
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add Index
CREATE INDEX IF NOT EXISTS idx_quizzes_module_id ON quizzes(module_id);

-- 3. Enable RLS
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- Public Read Access (for Course Player)
CREATE POLICY "Public can view quizzes" ON quizzes
    FOR SELECT USING (true);

-- Admin Write Access
CREATE POLICY "Admins can manage quizzes" ON quizzes
    FOR ALL USING (
        auth.role() = 'service_role' OR 
        auth.jwt() ->> 'email' IN ('michael@voxlux.com', 'admin@voxlux.com') -- Replace with actual admin logic if needed
    );

-- 5. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quizzes_updated_at
    BEFORE UPDATE ON quizzes
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
