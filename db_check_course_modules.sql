
-- Check Courses
SELECT id, slug, title FROM courses WHERE slug IN ('matrice-1', 'matrice-2');

-- Check Modules for Matrice 1 (Storytelling)
SELECT 
    m.id, 
    m.title, 
    m.order_index, 
    COUNT(l.id) as lesson_count
FROM modules m
LEFT JOIN lessons l ON m.id = l.module_id
WHERE m.course_id = (SELECT id FROM courses WHERE slug = 'matrice-1')
GROUP BY m.id, m.title, m.order_index
ORDER BY m.order_index;

-- Check Modules for Matrice 2 (Podcast)
SELECT 
    m.id, 
    m.title, 
    m.order_index, 
    COUNT(l.id) as lesson_count
FROM modules m
LEFT JOIN lessons l ON m.id = l.module_id
WHERE m.course_id = (SELECT id FROM courses WHERE slug = 'matrice-2')
GROUP BY m.id, m.title, m.order_index
ORDER BY m.order_index;
