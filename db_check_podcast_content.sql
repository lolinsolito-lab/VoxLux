-- CHECK PODCAST CONTENT
-- Run this in Supabase SQL Editor to see what is actually in the DB

SELECT 
    m.title as Module_Title, 
    m.order_index as Module_Order,
    l.title as Lesson_Title, 
    l.order_index as Lesson_Order
FROM modules m
LEFT JOIN lessons l ON m.id = l.module_id
WHERE m.course_id = 'matrice-2'
ORDER BY m.order_index, l.order_index;
