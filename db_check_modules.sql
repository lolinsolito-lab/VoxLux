-- Check header
select id, title from courses where slug = 'matrice-2';

-- Check module count
select count(*) from course_modules 
where course_id = (select id from courses where slug = 'matrice-2');

-- Show the modules to see if they are sequential
select title, module_order from course_modules 
where course_id = (select id from courses where slug = 'matrice-2')
order by module_order;
