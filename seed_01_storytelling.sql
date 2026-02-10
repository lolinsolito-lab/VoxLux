-- ═══════════════════════════════════════════════════════════════
-- 🧬 SEED 01: STORYTELLING MASTERMIND (Matrice 1)
-- ═══════════════════════════════════════════════════════════════
-- Esegui questo script per resettare/popolare la struttura di Matrice 1.
-- ATTENZIONE: Usa ON CONFLICT per evitare duplicati, ma aggiorna i testi.

-- 1. Create/Update COURSE
INSERT INTO courses (slug, title, description, display_order, status, thumbnail_url, tier_required)
VALUES (
    'matrice-1',
    'Matrice 1: Storytelling Mastermind',
    'L''arte di dominare la narrazione e riscrivere la realtà.',
    1,
    'published',
    '/assets/images/courses/storytelling-cover.webp',
    ARRAY['matrice-1', 'ascension-box']
)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    tier_required = EXCLUDED.tier_required;

-- 2. Create MODULES (The 10 Worlds)
DO $$
DECLARE
    c_id UUID;
    m_id UUID;
    worlds_data jsonb := '[
        {"idx": 0, "title": "Mondo 1: Origine", "desc": "La genesi del tuo mito."},
        {"idx": 1, "title": "Mondo 2: Confitto", "desc": "Il motore della narrazione."},
        {"idx": 2, "title": "Mondo 3: Risonanza", "desc": "Vibrare alla frequenza del pubblico."},
        {"idx": 3, "title": "Mondo 4: Archetipi", "desc": "Le maschere del potere."},
        {"idx": 4, "title": "Mondo 5: Struttura", "desc": "Architettura invisibile."},
        {"idx": 5, "title": "Mondo 6: Ritmo", "desc": "Il battito cardiaco della storia."},
        {"idx": 6, "title": "Mondo 7: Simboli", "desc": "Il linguaggio dell''inconscio."},
        {"idx": 7, "title": "Mondo 8: Voce", "desc": "Il timbro della verità."},
        {"idx": 8, "title": "Mondo 9: Immersione", "desc": "Creare mondi completi."},
        {"idx": 9, "title": "Mondo 10: Eredità", "desc": "Scrivere per l''eternità."}
    ]';
    w jsonb;
BEGIN
    SELECT id INTO c_id FROM courses WHERE slug = 'matrice-1';

    FOR w IN SELECT * FROM jsonb_array_elements(worlds_data)
    LOOP
        -- Insert Module
        INSERT INTO modules (course_id, title, description, order_index, is_locked)
        VALUES (c_id, w->>'title', w->>'desc', (w->>'idx')::int, false)
        ON CONFLICT (course_id, order_index) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description
        RETURNING id INTO m_id;

        -- Insert 3 Standard Lessons (Sun, Moon, Thread)
        -- Lesson 1: Sun (Theory)
        INSERT INTO lessons (module_id, title, description, order_index, video_provider)
        VALUES (m_id, 'Fase 1: Helios (Teoria)', 'I principi fondamentali della ' || (w->>'title'), 0, 'custom')
        ON CONFLICT (module_id, order_index) DO NOTHING;

        -- Lesson 2: Moon (Psychology)
        INSERT INTO lessons (module_id, title, description, order_index, video_provider)
        VALUES (m_id, 'Fase 2: Selene (Psicologia)', 'L''impatto emotivo e psicologico.', 1, 'custom')
        ON CONFLICT (module_id, order_index) DO NOTHING;

        -- Lesson 3: Thread (Practice)
        INSERT INTO lessons (module_id, title, description, order_index, video_provider)
        VALUES (m_id, 'Fase 3: Praxis (Il Filo d''Oro)', 'Esercizio pratico di integrazione.', 2, 'custom')
        ON CONFLICT (module_id, order_index) DO NOTHING;

    END LOOP;
END $$;
