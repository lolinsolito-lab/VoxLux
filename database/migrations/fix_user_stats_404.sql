-- FIX USER STATS 404 LOOP
-- This script backfills missing user_stats records for existing users.

-- 1. Insert missing user_stats for all users in auth.users
INSERT INTO public.user_stats (user_id, total_xp, current_level, level_name)
SELECT 
    id, 
    0, 
    0, 
    'Novizio'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_stats)
ON CONFLICT (user_id) DO NOTHING;

-- 2. Verify it worked
SELECT count(*) as fixed_users FROM public.user_stats;
