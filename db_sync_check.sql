-- DIAGNOSTICA SINCRONIZZAZIONE SCHEMA
-- Verifichiamo dove sono i dati per capire come aggiornare il Frontend

SELECT 'CONTROLLO MATRICE-1 (Storytelling)' as Check_Title;

-- 1. Vecchio Schema (course_modules)
SELECT count(*) as old_schema_count 
FROM course_modules 
WHERE course_id IN (SELECT id FROM courses WHERE slug = 'matrice-1');

-- 2. Nuovo Schema (modules + lessons)
SELECT count(*) as new_schema_worlds 
FROM modules 
WHERE course_id = 'matrice-1';

SELECT count(*) as new_schema_lessons
FROM lessons l
JOIN modules m ON l.module_id = m.id
WHERE m.course_id = 'matrice-1';

-----------------------------------------------------------

SELECT 'CONTROLLO MATRICE-2 (Podcast)' as Check_Title;

-- 1. Vecchio Schema
SELECT count(*) as old_schema_count 
FROM course_modules 
WHERE course_id IN (SELECT id FROM courses WHERE slug = 'matrice-2');

-- 2. Nuovo Schema
SELECT count(*) as new_schema_worlds 
FROM modules 
WHERE course_id = 'matrice-2';
