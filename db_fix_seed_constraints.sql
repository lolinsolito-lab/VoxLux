-- ═══════════════════════════════════════════════════════════════
-- 🛠️ FIX CONSTRAINTS (Prerequisito per i Seed)
-- ═══════════════════════════════════════════════════════════════
-- Esegui questo script PRIMA dei file seed per abilitare l'upsert (ON CONFLICT).

-- 1. MODULES: Unicità per (Corso + Ordine)
-- Permette di aggiornare un modulo esistente invece di duplicarlo
CREATE UNIQUE INDEX IF NOT EXISTS idx_modules_course_order_unique 
ON modules (course_id, order_index);

-- 2. LESSONS: Unicità per (Modulo + Ordine)
-- Permette di aggiornare una lezione esistente invece di duplicarla
CREATE UNIQUE INDEX IF NOT EXISTS idx_lessons_module_order_unique 
ON lessons (module_id, order_index);

-- 3. QUIZZES: Unicità per (Modulo)
-- Un modulo può avere un solo quiz
CREATE UNIQUE INDEX IF NOT EXISTS idx_quizzes_module_unique 
ON quizzes (module_id);

-- 4. COURSES: Verifica Slug (dovrebbe già essere PK o Unique, ma nel dubbio)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'courses_slug_key') THEN
        CREATE UNIQUE INDEX IF NOT EXISTS idx_courses_slug_unique ON courses(slug);
    END IF;
END $$;
