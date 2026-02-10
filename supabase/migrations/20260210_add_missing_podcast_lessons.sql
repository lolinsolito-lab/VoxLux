-- ═══════════════════════════════════════════════════════════════
-- ➕ AGGIUNGI 2 LESSONS MANCANTI - Podcast
-- ═══════════════════════════════════════════════════════════════

-- MONDO 5: Produzione & Edit (Production & Editing)
-- MONDO 6: Sound Design

-- ══════════════════════════════════════════════════════════════
-- STEP 1: Trova gli ID dei moduli Mondo 5 e Mondo 6
-- ══════════════════════════════════════════════════════════════

-- Query diagnostica per ottenere gli ID
SELECT 
    id as module_id,
    title,
    order_index
FROM modules
WHERE course_id = 'matrice-2' 
AND order_index IN (4, 5)  -- Mondo 5 = index 4, Mondo 6 = index 5
ORDER BY order_index;

-- ══════════════════════════════════════════════════════════════
-- STEP 2: Inserisci Lesson 3 per Mondo 5 (Produzione & Edit)
-- ══════════════════════════════════════════════════════════════

-- NOTA: Sostituisci 'MONDO5_MODULE_ID' con l'ID reale dal risultato della query sopra

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
    'La Scultura Sonora' as title,
    'Tecniche avanzate di editing e automazione per trasformare registrazioni grezze in capolavori sonori. Workflow professionale con Audacity, Adobe Audition e Descript.' as description,
    2 as order_index,  -- Lesson 3 (index starts at 0)
    'youtube' as video_provider,
    'placeholder-video-id' as video_id,
    35 as duration_minutes,
    jsonb_build_array(
        jsonb_build_object(
            'label', 'Editing Workflow.pdf',
            'url', 'https://r2.voxlux.com/resources/editing-workflow.pdf',
            'type', 'pdf'
        ),
        jsonb_build_object(
            'label', 'Automation Scripts.zip',
            'url', 'https://r2.voxlux.com/resources/automation-scripts.zip',
            'type', 'download'
        )
    ) as resources
FROM modules m
WHERE m.course_id = 'matrice-2'
AND m.order_index = 4  -- Mondo 5
AND NOT EXISTS (
    SELECT 1 FROM lessons l 
    WHERE l.module_id = m.id 
    AND l.order_index = 2
);

-- ══════════════════════════════════════════════════════════════
-- STEP 3: Inserisci Lesson 3 per Mondo 6 (Sound Design)
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
    'Design sonoro emozionale: layering, texture ambientali, e psicoacustica applicata. Crea soundscapes che manipolano lo stato emotivo dell''ascoltatore.' as description,
    2 as order_index,  -- Lesson 3 (index starts at 0)
    'youtube' as video_provider,
    'placeholder-video-id' as video_id,
    35 as duration_minutes,
    jsonb_build_array(
        jsonb_build_object(
            'label', 'Sound FX Library.zip',
            'url', 'https://r2.voxlux.com/resources/sound-fx-library.zip',
            'type', 'download'
        ),
        jsonb_build_object(
            'label', 'Layering Guide.pdf',
            'url', 'https://r2.voxlux.com/resources/layering-guide.pdf',
            'type', 'pdf'
        )
    ) as resources
FROM modules m
WHERE m.course_id = 'matrice-2'
AND m.order_index = 5  -- Mondo 6
AND NOT EXISTS (
    SELECT 1 FROM lessons l 
    WHERE l.module_id = m.id 
    AND l.order_index = 2
);

-- ══════════════════════════════════════════════════════════════
-- VERIFICA FINALE
-- ══════════════════════════════════════════════════════════════

SELECT 
    m.order_index + 1 as mondo_num,
    m.title as mondo_title,
    COUNT(l.id) as lesson_count,
    CASE 
        WHEN COUNT(l.id) = 3 THEN '✅ COMPLETO'
        ELSE '⚠️ INCOMPLETO (' || COUNT(l.id) || '/3)'
    END as status
FROM modules m
LEFT JOIN lessons l ON l.module_id = m.id
WHERE m.course_id = 'matrice-2'
GROUP BY m.id, m.order_index, m.title
ORDER BY m.order_index;

-- ══════════════════════════════════════════════════════════════
-- CONTEGGIO TOTALE FINALE
-- ══════════════════════════════════════════════════════════════

SELECT 
    'Podcast Matrice II' as corso,
    COUNT(DISTINCT m.id) as totale_mondi,
    COUNT(l.id) as totale_lessons,
    CASE 
        WHEN COUNT(DISTINCT m.id) = 10 THEN '✅ OK'
        ELSE '⚠️ ERRORE'
    END as status_mondi,
    CASE 
        WHEN COUNT(l.id) = 30 THEN '✅ OK'
        ELSE '⚠️ ERRORE'
    END as status_lessons
FROM modules m
LEFT JOIN lessons l ON l.module_id = m.id
WHERE m.course_id = 'matrice-2';

-- ══════════════════════════════════════════════════════════════
-- RISULTATO ATTESO:
-- ══════════════════════════════════════════════════════════════
-- totale_mondi: 10 ✅
-- totale_lessons: 30 ✅
