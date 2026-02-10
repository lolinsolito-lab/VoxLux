-- READ LEGACY PODCAST MODULES FOR MIGRATION
SELECT 
    id, 
    title, 
    description, 
    content_type, 
    duration, 
    module_order 
FROM course_modules 
WHERE course_id IN (SELECT id FROM courses WHERE slug = 'matrice-2')
ORDER BY module_order;
