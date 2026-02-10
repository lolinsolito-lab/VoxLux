-- ═══════════════════════════════════════════════════════════════
-- 🔍 AUDIT COMPLETO - Struttura Corsi
-- Verifica che ogni Mondo abbia i moduli corretti
-- ═══════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════
-- 1. STORYTELLING (matrice-1) - Struttura Completa
-- ══════════════════════════════════════════════════════════════

SELECT 
    m.order_index + 1 as mondo_num,
    m.title as mondo_title,
    l.order_index + 1 as lesson_num,
    l.title as lesson_title,
    l.duration_minutes as durata,
    l.video_provider as tipo,
    -- Verifica che lesson appartenga al mondo corretto
    CASE 
        WHEN m.order_index = 0 AND l.order_index BETWEEN 0 AND 2 THEN '✅ OK'
        WHEN m.order_index = 1 AND l.order_index BETWEEN 0 AND 2 THEN '✅ OK'
        WHEN m.order_index = 2 AND l.order_index BETWEEN 0 AND 2 THEN '✅ OK'
        WHEN m.order_index = 3 AND l.order_index BETWEEN 0 AND 2 THEN '✅ OK'
        WHEN m.order_index = 4 AND l.order_index BETWEEN 0 AND 2 THEN '✅ OK'
        WHEN m.order_index = 5 AND l.order_index BETWEEN 0 AND 2 THEN '✅ OK'
        WHEN m.order_index = 6 AND l.order_index BETWEEN 0 AND 2 THEN '✅ OK'
        WHEN m.order_index = 7 AND l.order_index BETWEEN 0 AND 2 THEN '✅ OK'
        WHEN m.order_index = 8 AND l.order_index BETWEEN 0 AND 2 THEN '✅ OK'
        WHEN m.order_index = 9 AND l.order_index BETWEEN 0 AND 2 THEN '✅ OK'
        ELSE '⚠️ ERRORE: Lesson fuori range'
    END as status
FROM modules m
LEFT JOIN lessons l ON l.module_id = m.id
WHERE m.course_id = 'matrice-1'
ORDER BY m.order_index, l.order_index;

-- ══════════════════════════════════════════════════════════════
-- 2. PODCAST (matrice-2) - Struttura Completa
-- ══════════════════════════════════════════════════════════════

SELECT 
    m.order_index + 1 as mondo_num,
    m.title as mondo_title,
    l.order_index + 1 as lesson_num,
    l.title as lesson_title,
    l.duration_minutes as durata,
    l.video_provider as tipo,
    CASE 
        WHEN m.order_index BETWEEN 0 AND 9 AND l.order_index BETWEEN 0 AND 2 THEN '✅ OK'
        ELSE '⚠️ ERRORE: Lesson fuori range'
    END as status
FROM modules m
LEFT JOIN lessons l ON l.module_id = m.id
WHERE m.course_id = 'matrice-2'
ORDER BY m.order_index, l.order_index;

-- ══════════════════════════════════════════════════════════════
-- 3. CONTEGGIO TOTALE per CORSO
-- ══════════════════════════════════════════════════════════════

SELECT 
    c.title as corso,
    COUNT(DISTINCT m.id) as totale_mondi,
    COUNT(l.id) as totale_lessons,
    CASE 
        WHEN COUNT(DISTINCT m.id) = 10 THEN '✅ 10 Mondi OK'
        ELSE '⚠️ Mondi mancanti/extra'
    END as status_mondi,
    CASE 
        WHEN COUNT(l.id) = 30 THEN '✅ 30 Lessons OK'
        ELSE '⚠️ Lessons mancanti/extra'
    END as status_lessons
FROM courses c
LEFT JOIN modules m ON m.course_id = c.slug
LEFT JOIN lessons l ON l.module_id = m.id
WHERE c.slug IN ('matrice-1', 'matrice-2')
GROUP BY c.slug, c.title
ORDER BY c.slug;

-- ══════════════════════════════════════════════════════════════
-- 4. VERIFICA DUPLICATI (stesso titolo in più mondi)
-- ══════════════════════════════════════════════════════════════

SELECT 
    l.title as lesson_title,
    COUNT(DISTINCT m.id) as appare_in_mondi,
    STRING_AGG(DISTINCT m.title, ' | ') as mondi,
    CASE 
        WHEN COUNT(DISTINCT m.id) > 1 THEN '⚠️ DUPLICATO'
        ELSE '✅ OK'
    END as status
FROM lessons l
JOIN modules m ON l.module_id = m.id
WHERE m.course_id IN ('matrice-1', 'matrice-2')
GROUP BY l.title
HAVING COUNT(DISTINCT m.id) > 1;

-- ══════════════════════════════════════════════════════════════
-- 5. VERIFICA ORDER_INDEX CONSECUTIVI (no gap)
-- ══════════════════════════════════════════════════════════════

WITH expected_indexes AS (
    SELECT 
        m.id as module_id,
        m.title as module_title,
        m.course_id,
        generate_series(0, 2) as expected_idx
    FROM modules m
    WHERE m.course_id IN ('matrice-1', 'matrice-2')
),
actual_indexes AS (
    SELECT 
        l.module_id,
        l.order_index
    FROM lessons l
)
SELECT 
    ei.course_id as corso,
    ei.module_title as mondo,
    ei.expected_idx as lesson_attesa,
    COALESCE(ai.order_index, -1) as lesson_presente,
    CASE 
        WHEN ai.order_index IS NOT NULL THEN '✅ OK'
        ELSE '⚠️ MANCANTE'
    END as status
FROM expected_indexes ei
LEFT JOIN actual_indexes ai 
    ON ai.module_id = ei.module_id 
    AND ai.order_index = ei.expected_idx
WHERE ai.order_index IS NULL  -- Mostra solo i problemi
ORDER BY ei.course_id, ei.module_title, ei.expected_idx;

-- ══════════════════════════════════════════════════════════════
-- 6. RIEPILOGO FINALE
-- ══════════════════════════════════════════════════════════════

SELECT 
    '=== RIEPILOGO AUDIT ===' as report,
    (SELECT COUNT(*) FROM modules WHERE course_id = (SELECT id::text FROM courses WHERE slug = 'matrice-1')) as storytelling_mondi,
    (SELECT COUNT(*) FROM lessons l JOIN modules m ON l.module_id = m.id WHERE m.course_id = (SELECT id::text FROM courses WHERE slug = 'matrice-1')) as storytelling_lessons,
    (SELECT COUNT(*) FROM modules WHERE course_id = (SELECT id::text FROM courses WHERE slug = 'matrice-2')) as podcast_mondi,
    (SELECT COUNT(*) FROM lessons l JOIN modules m ON l.module_id = m.id WHERE m.course_id = (SELECT id::text FROM courses WHERE slug = 'matrice-2')) as podcast_lessons;

-- ══════════════════════════════════════════════════════════════
-- 7. CHECK QUIZZES & DIPLOMAS
-- ══════════════════════════════════════════════════════════════
SELECT 
    '7️⃣ QUIZZES & DIPLOMAS' as section,
    c.title as course_name,
    COUNT(q.id) || ' Quizzes' as quiz_count,
    COALESCE(c.diploma_requirements->>'min_score_percent', 'N/A') || '% Min Score' as diploma_req
FROM courses c
LEFT JOIN modules m ON m.course_id = c.id::text
LEFT JOIN quizzes q ON q.module_id = m.id
WHERE c.slug IN ('matrice-1', 'matrice-2', 'ascension-box')
GROUP BY c.title, c.diploma_requirements
ORDER BY c.title;

-- ══════════════════════════════════════════════════════════════
-- 8. GHOST DETECTOR (Duplicate Titles Check)
-- ══════════════════════════════════════════════════════════════
SELECT 
    '8️⃣ GHOST DETECTOR' as section,
    title,
    id as course_id,
    slug,
    created_at
FROM courses
WHERE title IN (
    SELECT title FROM courses GROUP BY title HAVING COUNT(*) > 1
)
ORDER BY title, created_at DESC;
