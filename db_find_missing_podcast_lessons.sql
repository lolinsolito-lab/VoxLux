-- ═══════════════════════════════════════════════════════════════
-- 🔍 TROVA LESSONS MANCANTI - Podcast
-- ═══════════════════════════════════════════════════════════════

-- Query 1: Conta lesson per ogni Mondo Podcast
SELECT 
    m.order_index + 1 as mondo_num,
    m.title as mondo_title,
    COUNT(l.id) as lesson_count,
    CASE 
        WHEN COUNT(l.id) = 3 THEN '✅ OK'
        WHEN COUNT(l.id) < 3 THEN '⚠️ MANCANTI: ' || (3 - COUNT(l.id))::TEXT
        ELSE '⚠️ EXTRA: ' || (COUNT(l.id) - 3)::TEXT
    END as status
FROM modules m
LEFT JOIN lessons l ON l.module_id = m.id
WHERE m.course_id = 'matrice-2'
GROUP BY m.id, m.order_index, m.title
ORDER BY m.order_index;

-- Query 2: Dettaglio lessons presenti per ogni Mondo Podcast
SELECT 
    m.order_index + 1 as mondo_num,
    m.title as mondo_title,
    l.order_index as lesson_idx,
    l.title as lesson_title
FROM modules m
LEFT JOIN lessons l ON l.module_id = m.id
WHERE m.course_id = 'matrice-2'
ORDER BY m.order_index, l.order_index;

-- Query 3: Trova Mondi con lesson_index mancanti
WITH expected AS (
    SELECT 
        m.id as module_id,
        m.order_index + 1 as mondo_num,
        m.title as mondo_title,
        idx as expected_lesson_idx
    FROM modules m
    CROSS JOIN generate_series(0, 2) as idx
    WHERE m.course_id = 'matrice-2'
),
actual AS (
    SELECT 
        l.module_id,
        l.order_index as actual_lesson_idx
    FROM lessons l
    JOIN modules m ON l.module_id = m.id
    WHERE m.course_id = 'matrice-2'
)
SELECT 
    e.mondo_num,
    e.mondo_title,
    e.expected_lesson_idx,
    CASE 
        WHEN a.actual_lesson_idx IS NULL THEN '❌ MANCANTE'
        ELSE '✅ OK'
    END as status
FROM expected e
LEFT JOIN actual a ON a.module_id = e.module_id AND a.actual_lesson_idx = e.expected_lesson_idx
WHERE a.actual_lesson_idx IS NULL
ORDER BY e.mondo_num, e.expected_lesson_idx;
