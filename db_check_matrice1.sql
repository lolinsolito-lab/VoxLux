-- Check if Matrice 1 exists in the NEW schema
SELECT count(*) as matrice1_worlds FROM modules WHERE course_id = 'matrice-1';

-- Check if Matrice 1 exists in the OLD schema (if table exists)
-- SELECT count(*) as old_modules FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'matrice-1');
