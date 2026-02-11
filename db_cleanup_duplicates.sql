-- CLEANUP DUPLICATE PURCHASES
-- Keeps only the MOST RECENT purchase for each (user_id, course_id) pair
-- Deletes older duplicates

WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
            PARTITION BY user_id, course_id 
            ORDER BY created_at DESC
         ) as row_num
  FROM public.purchases
  WHERE status = 'active'
)
DELETE FROM public.purchases
WHERE id IN (
  SELECT id FROM duplicates WHERE row_num > 1
);

-- CLEANUP STALE QUIZ RESULTS (Optional, just in case)
-- Keeps most recent result per module per user
WITH quiz_duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
            PARTITION BY user_id, module_id 
            ORDER BY created_at DESC
         ) as row_num
  FROM public.quiz_results
)
DELETE FROM public.quiz_results
WHERE id IN (
  SELECT id FROM quiz_duplicates WHERE row_num > 1
);
