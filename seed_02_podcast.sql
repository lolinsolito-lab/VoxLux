-- ═══════════════════════════════════════════════════════════════
-- 🎙️ SEED 02: PODCAST MASTERMIND (Matrice 2)
-- ═══════════════════════════════════════════════════════════════

-- 1. Create/Update COURSE
INSERT INTO courses (slug, title, description, display_order, status, thumbnail_url, tier_required)
VALUES (
    'matrice-2',
    'Matrice 2: Podcast Mastermind',
    'La scienza di creare segnali che attraversano il rumore.',
    2,
    'published',
    '/assets/images/courses/podcast-cover.webp',
    ARRAY['matrice-2', 'ascension-box']
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
        {"idx": 0, "title": "Mondo 1: Frequenza", "desc": "Trovare la tua onda portante."},
        {"idx": 1, "title": "Mondo 2: Segnale", "desc": "Distinguersi dal rumore di fondo."},
        {"idx": 2, "title": "Mondo 3: Risonanza", "desc": "Amplificare l''impatto emotivo."},
        {"idx": 3, "title": "Mondo 4: Ospiti", "desc": "L''arte dell''intervista strategica."},
        {"idx": 4, "title": "Mondo 5: Formato", "desc": "Strutturare l''invisibile."},
        {"idx": 5, "title": "Mondo 6: Voce", "desc": "Il tuo strumento di potere."},
        {"idx": 6, "title": "Mondo 7: Distribuzione", "desc": "Dominare le piattaforme."},
        {"idx": 7, "title": "Mondo 8: Monetizzazione", "desc": "Trasformare l''ascolto in valore."},
        {"idx": 8, "title": "Mondo 9: Community", "desc": "Costruire una tribù fedele."},
        {"idx": 9, "title": "Mondo 10: Eredità", "desc": "Il podcast come asset eterno."}
    ]';
    w jsonb;
BEGIN
    SELECT id INTO c_id FROM courses WHERE slug = 'matrice-2';

    FOR w IN SELECT * FROM jsonb_array_elements(worlds_data)
    LOOP
        -- Insert Module with SLUG (m2-X)
        INSERT INTO modules (course_id, slug, title, description, order_index, is_locked)
        VALUES (
            c_id, 
            'm2-' || ((w->>'idx')::int + 1), -- e.g. m2-1
            w->>'title', 
            w->>'desc', 
            (w->>'idx')::int, 
            false
        )
        ON CONFLICT (course_id, order_index) DO UPDATE SET
            slug = EXCLUDED.slug,
            title = EXCLUDED.title,
            description = EXCLUDED.description
        RETURNING id INTO m_id;

        -- Insert 3 Standard Lessons
        -- Lesson 1: Sun (Strategy)
        INSERT INTO lessons (module_id, slug, title, description, order_index, video_provider)
        VALUES (
            m_id, 
            'm2-' || ((w->>'idx')::int + 1) || '-1',
            'Fase 1: Helios (Strategia)', 
            'La visione strategica di ' || (w->>'title'), 
            0, 
            'custom'
        )
        ON CONFLICT (module_id, order_index) DO UPDATE SET slug = EXCLUDED.slug;

        -- Lesson 2: Moon (Psychology/Mindset)
        INSERT INTO lessons (module_id, slug, title, description, order_index, video_provider)
        VALUES (
            m_id, 
            'm2-' || ((w->>'idx')::int + 1) || '-2',
            'Fase 2: Selene (Mindset)', 
            'L''approccio mentale corretto.', 
            1, 
            'custom'
        )
        ON CONFLICT (module_id, order_index) DO UPDATE SET slug = EXCLUDED.slug;

        -- Lesson 3: Signal (Technical/Execution)
        INSERT INTO lessons (module_id, slug, title, description, order_index, video_provider)
        VALUES (
            m_id, 
            'm2-' || ((w->>'idx')::int + 1) || '-3',
            'Fase 3: Segnale (Esecuzione)', 
            'Tecnica e pratica operativa.', 
            2, 
            'custom'
        )
        ON CONFLICT (module_id, order_index) DO UPDATE SET slug = EXCLUDED.slug;

    END LOOP;
END $$;
