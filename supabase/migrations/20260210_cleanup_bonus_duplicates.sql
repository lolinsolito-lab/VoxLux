-- ═══════════════════════════════════════════════════════════════
-- 🧹 BONUS CLEANUP — Remove Duplicates, Keep Rules
-- Run AFTER verifying migration was successful
-- ═══════════════════════════════════════════════════════════════

-- Strategy: For each duplicated bonus, KEEP the row that has a
-- required_course_id set (the one with the rule), DELETE the orphan.

-- 1. Masterclass: AI Voice Cloning (keep matrice-2 version)
DELETE FROM bonus_content 
WHERE title = '🎙️ Masterclass: AI Voice Cloning' 
AND required_course_id IS NULL;

-- 2. Swipe Files Pro Edition (keep matrice-1 version)
DELETE FROM bonus_content 
WHERE title = '📄 Swipe Files Pro Edition' 
AND required_course_id IS NULL;

-- 3. Framework Viralità Garantita (keep matrice-1 version)
DELETE FROM bonus_content 
WHERE title = '🔥 Framework Viralità Garantita' 
AND required_course_id IS NULL;

-- 4. Sessione Strategica VIP — Both rows have NULL course_id.
--    Keep only ONE row and set it as global (available to all).
DELETE FROM bonus_content
WHERE id = (
    SELECT id FROM bonus_content 
    WHERE title = '🎯 Sessione Strategica VIP' 
    ORDER BY created_at ASC 
    LIMIT 1
);

-- Make the surviving Sessione Strategica VIP a global bonus
UPDATE bonus_content 
SET is_global_bonus = true 
WHERE title = '🎯 Sessione Strategica VIP';

-- 5. Fix Sessione 1-on-1 VIP — Remove placeholder Stripe ID (not real)
UPDATE bonus_content 
SET stripe_product_id = NULL 
WHERE title = 'Sessione 1-on-1 VIP' 
AND stripe_product_id = 'prod_vip_session_placeholder';

-- ═══════════════════════════════════════════════════════════════
-- VERIFY: Should return exactly 7 unique bonuses, 0 duplicates
-- ═══════════════════════════════════════════════════════════════
SELECT title, required_course_id, is_global_bonus, delivery_type 
FROM bonus_content 
ORDER BY title;
