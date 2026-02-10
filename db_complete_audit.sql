-- ═══════════════════════════════════════════════════════════════
-- 📊 AUDIT COMPLETO DATABASE - Storytelling + Podcast
-- ═══════════════════════════════════════════════════════════════

-- Query 1: STORYTELLING - Tutti i Mondi e Lessons
SELECT 
    m.order_index + 1 as mondo,
    m.title as mondo_title,
    l.order_index + 1 as lesson,
    l.title as lesson_title,
    l.duration_minutes as durata,
    l.video_provider as tipo
FROM modules m
LEFT JOIN lessons l ON l.module_id = m.id
WHERE m.course_id = 'matrice-1'
ORDER BY m.order_index, l.order_index;

-- Query 2: PODCAST - Tutti i Mondi e Lessons
SELECT 
    m.order_index + 1 as mondo,
    m.title as mondo_title,
    l.order_index + 1 as lesson,
    l.title as lesson_title,
    l.duration_minutes as durata,
    l.video_provider as tipo
FROM modules m
LEFT JOIN lessons l ON l.module_id = m.id
WHERE m.course_id = 'matrice-2'
ORDER BY m.order_index, l.order_index;

-- Query 3: CONTEGGIO PER MONDO (entrambi i corsi)
SELECT 
    m.course_id,
    m.order_index + 1 as mondo,
    m.title,
    COUNT(l.id) as lessons,
    CASE 
        WHEN COUNT(l.id) = 3 THEN '✅'
        WHEN COUNT(l.id) < 3 THEN '⚠️ MANCANTI: ' || (3 - COUNT(l.id))
        ELSE '⚠️ EXTRA: ' || (COUNT(l.id) - 3)
    END as status
FROM modules m
LEFT JOIN lessons l ON l.module_id = m.id
WHERE m.course_id IN ('matrice-1', 'matrice-2')
GROUP BY m.course_id, m.order_index, m.title
ORDER BY m.course_id, m.order_index;
