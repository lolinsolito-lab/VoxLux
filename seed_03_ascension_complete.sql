-- ═══════════════════════════════════════════════════════════════
-- 🏆 SEED 03: ASCENSION COMPLETE (Diplomi, Quiz, Bonus)
-- ═══════════════════════════════════════════════════════════════

-- 1. SCHEMA UPDATE: DIPLOMA & BONUS
-- Aggiungi colonne per gestire i requisiti del diploma direttamente nel corso
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'diploma_requirements') THEN
        ALTER TABLE courses ADD COLUMN diploma_requirements JSONB DEFAULT NULL;
    END IF;
END $$;

-- 2. UPDATE COURSES WITH DIPLOMA REQUIREMENTS (100% Completion)
UPDATE courses 
SET diploma_requirements = '{
    "min_score_percent": 100,
    "required_quizzes": "all",
    "required_lessons": "all",
    "diploma_template_id": "diploma_matrice_1_v1"
}'
WHERE slug = 'matrice-1';

UPDATE courses 
SET diploma_requirements = '{
    "min_score_percent": 100,
    "required_quizzes": "all",
    "required_lessons": "all",
    "diploma_template_id": "diploma_matrice_2_v1"
}'
WHERE slug = 'matrice-2';

-- 3. CREATE FINAL EXAMS (QUIZZES)
-- Creiamo un Quiz Finale per l'ultimo mondo di ogni corso (Mondo 10)
DO $$
DECLARE
    m1_last_module_id UUID;
    m2_last_module_id UUID;
BEGIN
    -- Get Level 10 Module IDs (Cast UUID to TEXT for comparison)
    SELECT id INTO m1_last_module_id FROM modules WHERE course_id = (SELECT id::text FROM courses WHERE slug = 'matrice-1') AND order_index = 9 LIMIT 1;
    SELECT id INTO m2_last_module_id FROM modules WHERE course_id = (SELECT id::text FROM courses WHERE slug = 'matrice-2') AND order_index = 9 LIMIT 1;

    -- Quiz Matrice 1 (Storytelling)
    IF m1_last_module_id IS NOT NULL THEN
        INSERT INTO quizzes (module_id, title, description, passing_score, questions)
        VALUES (
            m1_last_module_id,
            'Esame Finale: Sovrano dello Storytelling',
            'Dimostra di aver interiorizzato i 10 Mondi. Il 100% è richiesto per la Gloria (e il Diploma).',
            100,
            '[
                {
                    "id": "q1",
                    "text": "Qual è il vero scopo del Conflitto nella narrazione Vox Lux?",
                    "points": 20,
                    "options": [
                        {"id": "o1", "text": "Creare dramma inutile", "isCorrect": false},
                        {"id": "o2", "text": "Generare energia per il cambiamento", "isCorrect": true},
                        {"id": "o3", "text": "Allungare la storia", "isCorrect": false}
                    ]
                },
                {
                    "id": "q2",
                    "text": "Cosa rappresenta il Filo d''Oro?",
                    "points": 20,
                    "options": [
                        {"id": "o1", "text": "Una decorazione", "isCorrect": false},
                        {"id": "o2", "text": "La sintesi pratica e l''output trasformativo", "isCorrect": true},
                        {"id": "o3", "text": "Il costo del corso", "isCorrect": false}
                    ]
                }
            ]'::jsonb
        )
        ON CONFLICT (module_id) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            passing_score = EXCLUDED.passing_score,
            questions = EXCLUDED.questions;
    END IF;

    -- Quiz Matrice 2 (Podcast)
    IF m2_last_module_id IS NOT NULL THEN
        INSERT INTO quizzes (module_id, title, description, passing_score, questions)
        VALUES (
            m2_last_module_id,
            'Esame Finale: Architetto del Segnale',
            'Solo chi domina la frequenza può accedere all''Ascension Box. 100% Richiesto.',
            100,
            '[
                {
                    "id": "q1",
                    "text": "Cosa distingue il Segnale dal Rumore?",
                    "points": 20,
                    "options": [
                        {"id": "o1", "text": "Il volume", "isCorrect": false},
                        {"id": "o2", "text": "L''intenzionalità e la chiarezza strategica", "isCorrect": true},
                        {"id": "o3", "text": "La lunghezza dell''episodio", "isCorrect": false}
                    ]
                },
                {
                    "id": "q2",
                    "text": "Qual è l''obiettivo finale dell''Eredità (Mondo 10)?",
                    "points": 20,
                    "options": [
                        {"id": "o1", "text": "Vendere più ads", "isCorrect": false},
                        {"id": "o2", "text": "Creare un asset digitale intramontabile", "isCorrect": true},
                        {"id": "o3", "text": "Diventare famosi su TikTok", "isCorrect": false}
                    ]
                }
            ]'::jsonb
        )
        ON CONFLICT (module_id) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            passing_score = EXCLUDED.passing_score,
            questions = EXCLUDED.questions;
    END IF;

END $$;

-- 4. SEED ASCENSION BOX (Bonus Course)
INSERT INTO courses (slug, title, description, display_order, status, thumbnail_url, tier_required)
VALUES (
    'ascension-box',
    'Ascension Box: The Vault',
    'Risorse classificate, protocolli avanzati e strumenti per l''élite digitale.',
    3,
    'published',
    '/assets/images/courses/ascension-cover.webp',
    ARRAY['ascension-box']
)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description;

-- Add Modules to Ascension Box
DO $$
DECLARE
    ab_id UUID;
    m_id UUID;
BEGIN
    SELECT id INTO ab_id FROM courses WHERE slug = 'ascension-box';

    -- Module 1: Risorse
    INSERT INTO modules (course_id, title, description, order_index, is_locked)
    VALUES (ab_id, 'Protocolli Operativi', 'Template e Documenti ufficiali.', 0, false)
    ON CONFLICT (course_id, order_index) DO NOTHING;

    -- Module 2: Community
    INSERT INTO modules (course_id, title, description, order_index, is_locked)
    VALUES (ab_id, 'Network Access', 'Accesso ai canali privati.', 1, false)
    ON CONFLICT (course_id, order_index) DO NOTHING;
END $$;
