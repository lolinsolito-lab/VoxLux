-- MIGRATION: STORYTELLING COURSE (Matrice 1) → NEW SCHEMA (modules + lessons)
-- Mirrors the podcast migration pattern. 10 Worlds × 3 Lessons = 30 total.

DO $$
DECLARE
    v_course_id text := 'matrice-1';
    v_module_id uuid;
BEGIN
    -- 1. CLEANUP: Remove any existing new-schema data for matrice-1
    DELETE FROM lessons WHERE module_id IN (SELECT id FROM modules WHERE course_id = v_course_id);
    DELETE FROM modules WHERE course_id = v_course_id;

    -- ═══════════════════════════════════════════════════
    -- WORLD 1: ORIGINE — "Dove la storia respira per la prima volta"
    -- ═══════════════════════════════════════════════════
    INSERT INTO modules (course_id, title, description, order_index, is_locked)
    VALUES (v_course_id, 'Mastermind 1: ORIGINE', 'Dove la storia respira per la prima volta', 0, false)
    RETURNING id INTO v_module_id;

    INSERT INTO lessons (module_id, title, description, video_provider, duration_minutes, order_index, resources) VALUES
    (v_module_id, 'Il Chiamare la Storia', 'Capisci cosa "ti chiama" a raccontare, definisci il perché del tuo podcast/narrazione e ritrovi la tua radice emotiva. Mini-rituale: Scrivi la prima frase che "ti trova".', 'custom', 18, 0, '[{"type":"output","label":"Prima Frase Rituale"}]'),
    (v_module_id, 'L''Ombra del Messaggio', 'Cosa la tua storia vuole trasformare, cosa succede davvero nell''ascoltatore e cosa resta quando la storia finisce. Mini-rituale: Identifica l''emozione madre del tuo progetto.', 'custom', 13, 1, '[{"type":"output","label":"Emozione Madre"}]'),
    (v_module_id, 'Il Sigillo dell''Intenzione', 'Stabilisci la tua direzione narrativa, dai energia al mondo che creerai e firmi il tuo "patto narrativo". Mini-rituale: Registra 20 secondi della tua intenzione vocale.', 'custom', 22, 2, '[{"type":"output","label":"Registrazione Intenzione (20s)"}]');

    -- ═══════════════════════════════════════════════════
    -- WORLD 2: PRESENZA — "La tua voce è il primo mondo che costruisci"
    -- ═══════════════════════════════════════════════════
    INSERT INTO modules (course_id, title, description, order_index, is_locked)
    VALUES (v_course_id, 'Mastermind 2: PRESENZA', 'La tua voce è il primo mondo che costruisci', 1, false)
    RETURNING id INTO v_module_id;

    INSERT INTO lessons (module_id, title, description, video_provider, duration_minutes, order_index, resources) VALUES
    (v_module_id, 'La Spina Dorsale della Voce', 'Grounding bio-meccanico. Abbassare il baricentro per alzare l''impatto. Rituale: Il Pilastro Sonoro.', 'custom', 20, 0, '[{"type":"output","label":"Asset: Stabilità Paraverbale"}]'),
    (v_module_id, 'Il Punto di Sguardo (Gli Archetipi)', 'Indossare la maschera vocale corretta. Guerriero, Oracolo, Amante. Rituale: La Sala delle Maschere.', 'custom', 19, 1, '[{"type":"output","label":"Avatar Vocale Dominante"}]'),
    (v_module_id, 'La Firma Energetica', 'Sintetizzare Calore, Potenza e Velocità per creare il tuo Logo Sonoro unico. Rituale: Il Sintetizzatore d''Anima.', 'custom', 22, 2, '[{"type":"output","label":"Logo Sonoro Personale"}]');

    -- ═══════════════════════════════════════════════════
    -- WORLD 3: VISIONE — "I narratori vedono mondi prima che esistano"
    -- ═══════════════════════════════════════════════════
    INSERT INTO modules (course_id, title, description, order_index, is_locked)
    VALUES (v_course_id, 'Mastermind 3: VISIONE', 'I narratori vedono mondi prima che esistano.', 2, false)
    RETURNING id INTO v_module_id;

    INSERT INTO lessons (module_id, title, description, video_provider, duration_minutes, order_index, resources) VALUES
    (v_module_id, 'Il Teatro Interno', 'Show, Don''t Tell. Tradurre concetti astratti in immagini sensoriali. Rituale: L''Alchimista Visivo.', 'custom', 25, 0, '[{"type":"output","label":"Skill: Vista Cinematografica"}]'),
    (v_module_id, 'La Mappa Invisibile', 'Worldbuilding & Contextual Framing. L''ambiente come personaggio. Rituale: Il Genesi Point.', 'custom', 20, 1, '[{"type":"output","label":"Asset: Setting Canvas"}]'),
    (v_module_id, 'La Camera dell''Immagine', 'Mood, Tone & Sensory Priming. Definire la texture della narrazione. Rituale: Il Moodboard Vivente.', 'custom', 22, 2, '[{"type":"output","label":"Sigillo della Visione"}]');

    -- ═══════════════════════════════════════════════════
    -- WORLD 4: FREQUENZA — "La storia è un'onda. Impara a cavalcarla."
    -- ═══════════════════════════════════════════════════
    INSERT INTO modules (course_id, title, description, order_index, is_locked)
    VALUES (v_course_id, 'Mastermind 4: FREQUENZA', 'La storia è un''onda. Impara a cavalcarla.', 3, false)
    RETURNING id INTO v_module_id;

    INSERT INTO lessons (module_id, title, description, video_provider, duration_minutes, order_index, resources) VALUES
    (v_module_id, 'Il Respiro del Racconto', 'Potere della Pausa. Gestire il silenzio tattico. Rituale: Il Tagliatore di Tempo.', 'custom', 21, 0, '[{"type":"output","label":"Asset: Il Metronomo Interiore"}]'),
    (v_module_id, 'Il Tempo dell''Ascoltatore', 'Cognitive Load & Pacing. Dosare il flusso di informazioni. Rituale: Il Dosaggio Sacro.', 'custom', 17, 1, '[{"type":"output","label":"Tecnica: Pacing Adattivo"}]'),
    (v_module_id, 'Onde Emotive', 'Variazione Prosodica. Evitare la flatline. Rituale: Il Direttore d''Orchestra.', 'custom', 19, 2, '[{"type":"output","label":"Sigillo della Frequenza"}]');

    -- ═══════════════════════════════════════════════════
    -- WORLD 5: ARCHETIPI — "Indossa le maschere degli dei."
    -- ═══════════════════════════════════════════════════
    INSERT INTO modules (course_id, title, description, order_index, is_locked)
    VALUES (v_course_id, 'Mastermind 5: ARCHETIPI', 'Indossa le maschere degli dei.', 4, false)
    RETURNING id INTO v_module_id;

    INSERT INTO lessons (module_id, title, description, video_provider, duration_minutes, order_index, resources) VALUES
    (v_module_id, 'Il Custode (Chi è l''Eroe?)', 'Posizionamento della Guida. Tu non sei Luke, sei Yoda. Rituale: La Pulizia dello Specchio.', 'custom', 20, 0, '[{"type":"output","label":"Concetto: Posizionamento Guida"}]'),
    (v_module_id, 'L''Eroe Ferito (Il Difetto Fatale)', 'Vulnerabilità strategica. Kintsugi narrativo. Rituale: Il Kintsugi Digitale.', 'custom', 19, 1, '[{"type":"output","label":"Asset: Vulnerabilità Strategica"}]'),
    (v_module_id, 'L''Antagonista Invisibile', 'Definire il Nemico. Senza buio la luce non serve. Rituale: L''Evocazione della Bestia.', 'custom', 22, 2, '[{"type":"output","label":"Sigillo degli Archetipi"}]');

    -- ═══════════════════════════════════════════════════
    -- WORLD 6: NARRATIVA TATTICA — "La strategia è l'arte della guerra senza sangue."
    -- ═══════════════════════════════════════════════════
    INSERT INTO modules (course_id, title, description, order_index, is_locked)
    VALUES (v_course_id, 'Mastermind 6: NARRATIVA TATTICA', 'La strategia è l''arte della guerra senza sangue.', 5, false)
    RETURNING id INTO v_module_id;

    INSERT INTO lessons (module_id, title, description, video_provider, duration_minutes, order_index, resources) VALUES
    (v_module_id, 'Il Gancio di Ingresso (The Hook)', 'Pattern Interrupt. Catturare l''attenzione in 3 secondi. Rituale: Lo Spezza-Flusso.', 'custom', 18, 0, '[{"type":"output","label":"Tecnica: Pattern Interrupt"}]'),
    (v_module_id, 'Il Percorso dell''Attesa (Open Loops)', 'Effetto Zeigarnik. Costruire ponti di curiosità. Rituale: L''Architetto dei Ponti.', 'custom', 21, 1, '[{"type":"output","label":"Schema: Spirale di Tensione"}]'),
    (v_module_id, 'Il Punto di Rottura (Plot Twist)', 'Sorpresa e cambio di prospettiva. Rituale: Il Sabotaggio.', 'custom', 20, 2, '[{"type":"output","label":"Sigillo della Tattica"}]');

    -- ═══════════════════════════════════════════════════
    -- WORLD 7: EMPATIA STRATEGICA — "Connettersi è vincere."
    -- ═══════════════════════════════════════════════════
    INSERT INTO modules (course_id, title, description, order_index, is_locked)
    VALUES (v_course_id, 'Mastermind 7: EMPATIA STRATEGICA', 'Connettersi è vincere.', 6, false)
    RETURNING id INTO v_module_id;

    INSERT INTO lessons (module_id, title, description, video_provider, duration_minutes, order_index, resources) VALUES
    (v_module_id, 'Ascoltare il Non Detto', 'Sottotesto e Decodifica Emotiva. Rituale: Lo Spettro Emotivo.', 'custom', 20, 0, '[{"type":"output","label":"Skill: Decodifica Emotiva"}]'),
    (v_module_id, 'Il Calore della Voce', 'Intimità e Prossimità Vocale. Rituale: Il Cerchio del Fuoco.', 'custom', 18, 1, '[{"type":"output","label":"Tecnica: Prossimità Vocale"}]'),
    (v_module_id, 'La Mano sulla Spalla', 'Validazione ed Empatia Radicale. Rituale: Il Nodo d''Oro.', 'custom', 22, 2, '[{"type":"output","label":"Sigillo dell''Empatia"}]');

    -- ═══════════════════════════════════════════════════
    -- WORLD 8: ASCENSIONE — "Oltre la tecnica, c'è lo spirito."
    -- ═══════════════════════════════════════════════════
    INSERT INTO modules (course_id, title, description, order_index, is_locked)
    VALUES (v_course_id, 'Mastermind 8: ASCENSIONE', 'Oltre la tecnica, c''è lo spirito.', 7, false)
    RETURNING id INTO v_module_id;

    INSERT INTO lessons (module_id, title, description, video_provider, duration_minutes, order_index, resources) VALUES
    (v_module_id, 'Il Viaggio del Cambiamento', 'Trasformazione Before & After. Rituale: Il Ponte di Luce.', 'custom', 23, 0, '[{"type":"output","label":"Schema: Mappa della Trasformazione"}]'),
    (v_module_id, 'Il Fuoco della Decisione', 'Il Climax e la Call to Action irrevocabile. Rituale: Il Salto della Fede.', 'custom', 20, 1, '[{"type":"output","label":"Skill: Chiamata al Coraggio"}]'),
    (v_module_id, 'Il Rito dell''Avanzamento', 'Il Nuovo Normale e l''Incoronazione. Rituale: L''Incoronazione.', 'custom', 25, 2, '[{"type":"output","label":"Sigillo dell''Ascensione"}]');

    -- ═══════════════════════════════════════════════════
    -- WORLD 9: RIVELAZIONE — "La verità è l'unica moneta."
    -- ═══════════════════════════════════════════════════
    INSERT INTO modules (course_id, title, description, order_index, is_locked)
    VALUES (v_course_id, 'Mastermind 9: RIVELAZIONE', 'La verità è l''unica moneta.', 8, false)
    RETURNING id INTO v_module_id;

    INSERT INTO lessons (module_id, title, description, video_provider, duration_minutes, order_index, resources) VALUES
    (v_module_id, 'La Pelle che si Toglie', 'De-Cliché ed Essenzialità Radicale. Rituale: La Lama di Luce.', 'custom', 19, 0, '[{"type":"output","label":"Skill: Essenzialità Radicale"}]'),
    (v_module_id, 'La Voce Nuda', 'Improvvisazione e Flow. Rituale: Il Salto nel Buio.', 'custom', 21, 1, '[{"type":"output","label":"Asset: Fiducia Istintiva"}]'),
    (v_module_id, 'La Soglia della Verità', 'Core Story e Identità Profonda. Rituale: Il Passaggio della Soglia.', 'custom', 24, 2, '[{"type":"output","label":"Sigillo della Rivelazione"}]');

    -- ═══════════════════════════════════════════════════
    -- WORLD 10: MAESTRIA — "La storia è tua. Falla brillare."
    -- ═══════════════════════════════════════════════════
    INSERT INTO modules (course_id, title, description, order_index, is_locked)
    VALUES (v_course_id, 'Mastermind 10: MAESTRIA', 'La storia è tua. Falla brillare.', 9, false)
    RETURNING id INTO v_module_id;

    INSERT INTO lessons (module_id, title, description, video_provider, duration_minutes, order_index, resources) VALUES
    (v_module_id, 'La Sfera del Comando (Public Speaking)', 'Stage Presence. Dirigere l''energia della sala. Rituale: Il Direttore d''Orchestra.', 'custom', 24, 0, '[{"type":"output","label":"Skill: Dominio Scenico"}]'),
    (v_module_id, 'Il Cerchio Completo (Ring Composition)', 'Narrative Closure. Ricollegare la fine all''inizio. Rituale: L''Ouroboros.', 'custom', 19, 1, '[{"type":"output","label":"Asset: La Chiusura Perfetta"}]'),
    (v_module_id, 'Il Sigillo della Maestria', 'Certification. Fusione dell''identità. Rituale: La Fusione Finale.', 'custom', 35, 2, '[{"type":"output","label":"Diploma + Accesso Community"}]');

    RAISE NOTICE '✅ STORYTELLING MIGRATION COMPLETE: 10 worlds, 30 lessons inserted for matrice-1';
END $$;
