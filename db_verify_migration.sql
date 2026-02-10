-- VERIFY MIGRATION COMPLETENESS
-- Run this to confirm everything migrated correctly

-- 1. COUNT MODULES IN NEW SCHEMA (should be 10)
SELECT 'NEW MODULES' AS check_type, COUNT(*) AS total 
FROM modules WHERE course_id = 'matrice-2';

-- 2. LIST ALL MODULES WITH LESSON COUNT
SELECT m.title, m.order_index, COUNT(l.id) AS lesson_count
FROM modules m
LEFT JOIN lessons l ON l.module_id = m.id
WHERE m.course_id = 'matrice-2'
GROUP BY m.id, m.title, m.order_index
ORDER BY m.order_index;

-- 3. LEGACY TABLE CHECK (should still have rows, but we won't use them anymore)
SELECT 'LEGACY MODULES' AS check_type, COUNT(*) AS total 
FROM course_modules 
WHERE course_id IN (SELECT id FROM courses WHERE slug = 'matrice-2');

-- 4. BONUS CONTENT RULES CHECK
SELECT title, required_course_id, delivery_type, stripe_product_id
FROM bonus_content
ORDER BY title;
