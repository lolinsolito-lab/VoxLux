-- Migration to fill missing modules (WORLDS) and lessons for Matrice 2 (Podcast Course)
-- SCHEMA: 
-- "modules" table = WORLDS (Masterminds)
-- "lessons" table = MODULES (The actual content units)

DO $$
DECLARE
    v_course_id_str text := 'matrice-2';
    v_module_id uuid;
BEGIN
    -- Ensure we are targeting the right course
    -- Note: 'modules' table uses 'course_id' as TEXT, not UUID reference (based on schema)

    -- WORLD 7: Distribuzione Globale
    INSERT INTO modules (course_id, title, description, order_index, is_locked)
    VALUES (v_course_id_str, 'Mastermind 7: Distribuzione Globale', 'Strategie di lancio e diffusione.', 6, false)
    RETURNING id INTO v_module_id;

    INSERT INTO lessons (module_id, title, description, video_provider, duration_minutes, order_index, resources)
    VALUES 
    (v_module_id, 'Distribuzione Globale: Setup', 'Configurazione distribuzione su tutte le piattaforme.', 'custom', 18, 0, '[]'),
    (v_module_id, 'Distribuzione Globale: RSS', 'Gestione Feed RSS e metadati avanzati.', 'custom', 12, 1, '[]'),
    (v_module_id, 'Distribuzione Globale: Launch', 'Strategia di lancio e ranking.', 'custom', 35, 2, '[]');


    -- WORLD 8: Monetizzazione Audio
    INSERT INTO modules (course_id, title, description, order_index, is_locked)
    VALUES (v_course_id_str, 'Mastermind 8: Monetizzazione Audio', 'Trasformare l''ascolto in revenue.', 7, false)
    RETURNING id INTO v_module_id;

    INSERT INTO lessons (module_id, title, description, video_provider, duration_minutes, order_index, resources)
    VALUES 
    (v_module_id, 'Monetizzazione: Sponsor', 'Trovare e chiudere deal con sponsor.', 'custom', 18, 0, '[]'),
    (v_module_id, 'Monetizzazione: Premium', 'Creazione offerta podcast in abbonamento.', 'custom', 12, 1, '[]'),
    (v_module_id, 'Monetizzazione: Funnel', 'Convertire ascoltatori in clienti high-ticket.', 'custom', 35, 2, '[]');


    -- WORLD 9: AI Voice Cloning
    INSERT INTO modules (course_id, title, description, order_index, is_locked)
    VALUES (v_course_id_str, 'Mastermind 9: AI Voice Cloning', 'Il futuro della sintesi vocale.', 8, false)
    RETURNING id INTO v_module_id;

    INSERT INTO lessons (module_id, title, description, video_provider, duration_minutes, order_index, resources)
    VALUES 
    (v_module_id, 'AI Voice: Cloning', 'Tecniche di clonazione vocale neurale.', 'custom', 18, 0, '[]'),
    (v_module_id, 'AI Voice: Automation', 'Automazione produzione episodi con AI.', 'custom', 12, 1, '[]'),
    (v_module_id, 'AI Voice: Ethics', 'Gestione etica e legale della voce sintetica.', 'custom', 35, 2, '[]');


    -- WORLD 10: L''Eredità Sonora
    INSERT INTO modules (course_id, title, description, order_index, is_locked)
    VALUES (v_course_id_str, 'Mastermind 10: L''Eredità Sonora', 'Lasciare un segno indelebile.', 9, false)
    RETURNING id INTO v_module_id;

    INSERT INTO lessons (module_id, title, description, video_provider, duration_minutes, order_index, resources)
    VALUES 
    (v_module_id, 'Eredità: Archivio', 'Creazione di un archivio sonoro perenne.', 'custom', 18, 0, '[]'),
    (v_module_id, 'Eredità: Network', 'Espansione del network tramite audio.', 'custom', 12, 1, '[]'),
    (v_module_id, 'Eredità: Visione', 'Il futuro dell''audio immersivo.', 'custom', 35, 2, '[]');

END $$;
