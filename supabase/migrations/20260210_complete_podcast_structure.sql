-- ═══════════════════════════════════════════════════════════════
-- 🎧 PODCAST STRUCTURE COMPLETA - Aggiornamento Database
-- ═══════════════════════════════════════════════════════════════

-- STEP 1: Aggiorna titoli dei Mondi Podcast per coerenza professionale
UPDATE modules SET title = 'Mastermind 1: Fondazione Acustica',
    description = 'L''arte del silenzio e della purezza sonora. Setup professionale da casa e catena audio perfetta.'
WHERE course_id = 'matrice-2' AND order_index = 0;

UPDATE modules SET title = 'Mastermind 2: Psicologia Vocale',
    description = 'La tua voce è il primo strumento. Controllo vocale, respirazione e texture sonora.'
WHERE course_id = 'matrice-2' AND order_index = 1;

UPDATE modules SET title = 'Mastermind 3: Architettura Sonora',
    description = 'Costruire spazi con il suono. Trattamento acustico e spazialità.'
WHERE course_id = 'matrice-2' AND order_index = 2;

UPDATE modules SET title = 'Mastermind 4: Editing Strategico',
    description = 'La scultura del tempo sonoro. Post-produzione e pulizia audio professionale.'
WHERE course_id = 'matrice-2' AND order_index = 3;

UPDATE modules SET title = 'Mastermind 5: Produzione & Mix',
    description = 'Trasformare registrazioni in capolavori. EQ, layering e mastering per streaming.'
WHERE course_id = 'matrice-2' AND order_index = 4;

UPDATE modules SET title = 'Mastermind 6: Sound Design Emozionale',
    description = 'Manipolare stati emotivi con il suono. Palette sonora e architettura delle emozioni.'
WHERE course_id = 'matrice-2' AND order_index = 5;

UPDATE modules SET title = 'Mastermind 7: Interviste & Storytelling',
    description = 'L''arte di estrarre storie autentiche. Tecniche di intervista e montaggio narrativo.'
WHERE course_id = 'matrice-2' AND order_index = 6;

UPDATE modules SET title = 'Mastermind 8: Distribuzione Globale',
    description = 'Da locale a planetario. Piattaforme, SEO audio e viralità algoritmica.'
WHERE course_id = 'matrice-2' AND order_index = 7;

UPDATE modules SET title = 'Mastermind 9: Monetizzazione Audio',
    description = 'Trasformare ascoltatori in revenue. Sponsorizzazioni, membership e ecosystem audio.'
WHERE course_id = 'matrice-2' AND order_index = 8;

UPDATE modules SET title = 'Mastermind 10: AI Voice & Legacy',
    description = 'Il futuro del podcasting e la tua eredità. Voice cloning, automazione e impatto duraturo.'
WHERE course_id = 'matrice-2' AND order_index = 9;

-- ══════════════════════════════════════════════════════════════
-- STEP 2: Aggiungi Lesson 3 per Mondo 5 (Produzione & Mix)
-- ══════════════════════════════════════════════════════════════

INSERT INTO lessons (
    module_id,
    title,
    description,
    order_index,
    video_provider,
    video_id,
    duration_minutes,
    resources
)
SELECT 
    m.id as module_id,
    'Mastering per Streaming' as title,
    'Standard di loudness (LUFS), true peak, metadata e ottimizzazione per piattaforme streaming. Export settings professionali per Spotify, Apple Podcasts e YouTube.' as description,
    2 as order_index,
    'youtube' as video_provider,
    'placeholder-mastering-streaming' as video_id,
    24 as duration_minutes,
    jsonb_build_array(
        jsonb_build_object(
            'label', 'LUFS Target Guide.pdf',
            'url', 'https://r2.voxlux.com/resources/lufs-target-guide.pdf',
            'type', 'pdf'
        ),
        jsonb_build_object(
            'label', 'Platform Export Settings.xlsx',
            'url', 'https://r2.voxlux.com/resources/export-settings.xlsx',
            'type', 'download'
        )
    ) as resources
FROM modules m
WHERE m.course_id = 'matrice-2'
AND m.order_index = 4
AND NOT EXISTS (
    SELECT 1 FROM lessons l 
    WHERE l.module_id = m.id 
    AND l.order_index = 2
);

-- ══════════════════════════════════════════════════════════════
-- STEP 3: Aggiungi Lesson 3 per Mondo 6 (Sound Design Emozionale)
-- ══════════════════════════════════════════════════════════════

INSERT INTO lessons (
    module_id,
    title,
    description,
    order_index,
    video_provider,
    video_id,
    duration_minutes,
    resources
)
SELECT 
    m.id as module_id,
    'Architettura delle Emozioni' as title,
    'Design sonoro per manipolare stati emotivi: tensione, rilascio, climax. Costruire soundscapes che guidano l''ascoltatore attraverso un viaggio psico-acustico.' as description,
    2 as order_index,
    'youtube' as video_provider,
    'placeholder-emotional-architecture' as video_id,
    26 as duration_minutes,
    jsonb_build_array(
        jsonb_build_object(
            'label', 'Emotional Arc Templates.zip',
            'url', 'https://r2.voxlux.com/resources/emotional-arc-templates.zip',
            'type', 'download'
        ),
        jsonb_build_object(
            'label', 'Soundscape Examples.mp3',
            'url', 'https://r2.voxlux.com/resources/soundscape-examples.mp3',
            'type', 'audio'
        )
    ) as resources
FROM modules m
WHERE m.course_id = 'matrice-2'
AND m.order_index = 5
AND NOT EXISTS (
    SELECT 1 FROM lessons l 
    WHERE l.module_id = m.id 
    AND l.order_index = 2
);

-- ══════════════════════════════════════════════════════════════
-- VERIFICA FINALE
-- ══════════════════════════════════════════════════════════════

SELECT 
    m.order_index + 1 as mondo,
    m.title,
    COUNT(l.id) as lessons,
    CASE 
        WHEN COUNT(l.id) = 3 THEN '✅ COMPLETO'
        ELSE '⚠️ INCOMPLETO'
    END as status
FROM modules m
LEFT JOIN lessons l ON l.module_id = m.id
WHERE m.course_id = 'matrice-2'
GROUP BY m.id, m.order_index, m.title
ORDER BY m.order_index;

-- ══════════════════════════════════════════════════════════════
-- CONTEGGIO TOTALE
-- ══════════════════════════════════════════════════════════════

SELECT 
    'PODCAST MATRICE II' as corso,
    COUNT(DISTINCT m.id) as mondi,
    COUNT(l.id) as lessons,
    CASE 
        WHEN COUNT(DISTINCT m.id) = 10 AND COUNT(l.id) = 30 THEN '✅ PERFETTO'
        ELSE '⚠️ VERIFICA NECESSARIA'
    END as status
FROM modules m
LEFT JOIN lessons l ON l.module_id = m.id
WHERE m.course_id = 'matrice-2';

-- ══════════════════════════════════════════════════════════════
-- RISULTATO ATTESO:
-- ══════════════════════════════════════════════════════════════
-- Mondi: 10 ✅
-- Lessons: 30 ✅
-- Tutti i titoli coerenti e professionali ✅
