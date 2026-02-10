-- Migration to fill missing modules for Matrice 2 (Podcast Course)
-- We need 10 Worlds x 3 Modules = 30 Modules total.
-- Currently likely has 18 (6 Worlds).
-- We will insert modules 19-30.

DO $$
DECLARE
    v_course_id uuid;
BEGIN
    SELECT id INTO v_course_id FROM courses WHERE slug = 'matrice-2';

    IF v_course_id IS NULL THEN
        RAISE EXCEPTION 'Course matrice-2 not found';
    END IF;

    -- WORLD 7: Distribuzione Globale (Modules 19, 20, 21)
    INSERT INTO course_modules (course_id, title, description, content_type, duration, module_order)
    VALUES 
    (v_course_id, 'Distribuzione Globale: Setup', 'Configurazione distribuzione su tutte le piattaforme.', 'video', '18:45', 19),
    (v_course_id, 'Distribuzione Globale: RSS', 'Gestione Feed RSS e metadati avanzati.', 'audio', '12:00', 20),
    (v_course_id, 'Distribuzione Globale: Launch', 'Strategia di lancio e ranking.', 'video', '35:00', 21)
    ON CONFLICT (course_id, module_order) DO NOTHING;

    -- WORLD 8: Monetizzazione Audio (Modules 22, 23, 24)
    INSERT INTO course_modules (course_id, title, description, content_type, duration, module_order)
    VALUES 
    (v_course_id, 'Monetizzazione: Sponsor', 'Trovare e chiudere deal con sponsor.', 'video', '18:45', 22),
    (v_course_id, 'Monetizzazione: Premium', 'Creazione offerta podcast in abbonamento.', 'audio', '12:00', 23),
    (v_course_id, 'Monetizzazione: Funnel', 'Convertire ascoltatori in clienti high-ticket.', 'video', '35:00', 24)
    ON CONFLICT (course_id, module_order) DO NOTHING;

    -- WORLD 9: AI Voice Cloning (Modules 25, 26, 27)
    INSERT INTO course_modules (course_id, title, description, content_type, duration, module_order)
    VALUES 
    (v_course_id, 'AI Voice: Cloning', 'Tecniche di clonazione vocale neurale.', 'video', '18:45', 25),
    (v_course_id, 'AI Voice: Automation', 'Automazione produzione episodi con AI.', 'audio', '12:00', 26),
    (v_course_id, 'AI Voice: Ethics', 'Gestione etica e legale della voce sintetica.', 'video', '35:00', 27)
    ON CONFLICT (course_id, module_order) DO NOTHING;

    -- WORLD 10: L''Eredità Sonora (Modules 28, 29, 30)
    INSERT INTO course_modules (course_id, title, description, content_type, duration, module_order)
    VALUES 
    (v_course_id, 'Eredità: Archivio', 'Creazione di un archivio sonoro perenne.', 'video', '18:45', 28),
    (v_course_id, 'Eredità: Network', 'Espansione del network tramite audio.', 'audio', '12:00', 29),
    (v_course_id, 'Eredità: Visione', 'Il futuro dell''audio immersivo.', 'video', '35:00', 30)
    ON CONFLICT (course_id, module_order) DO NOTHING;

END $$;
