-- ═══════════════════════════════════════════════════════════════
-- 🎯 FIX FINALE: Bonus vs Extra - Distinzione Chiara
-- ═══════════════════════════════════════════════════════════════

-- REGOLA:
-- - BONUS = is_purchasable = FALSE (gratis se possiedi il corso)
-- - EXTRA = is_purchasable = TRUE (sempre a pagamento)

-- ══════════════════════════════════════════════════════════════
-- STEP 1: Bonus → NON Purchasable (Gratis con corso)
-- ══════════════════════════════════════════════════════════════

UPDATE bonus_content 
SET 
    is_purchasable = false,
    price_cents = 0
WHERE required_course_id IS NOT NULL;

-- ══════════════════════════════════════════════════════════════
-- STEP 2: Extra → Sempre Purchasable (Standalone)
-- ══════════════════════════════════════════════════════════════

UPDATE bonus_content 
SET 
    required_course_id = NULL,
    is_purchasable = true,
    price_cents = 19700  -- €197
WHERE title = 'Sessione 1-on-1 VIP';

-- ══════════════════════════════════════════════════════════════
-- VERIFICA: Risultato Finale
-- ══════════════════════════════════════════════════════════════

SELECT 
    title,
    required_course_id,
    is_purchasable,
    price_cents,
    CASE 
        WHEN is_purchasable = true THEN '💰 EXTRA (Pagamento)'
        WHEN required_course_id IS NOT NULL THEN '🎁 BONUS (Gratis con corso)'
        ELSE '⚠️ ERRORE (Configurazione non valida)'
    END as tipo
FROM bonus_content
ORDER BY is_purchasable DESC, title;

-- ══════════════════════════════════════════════════════════════
-- RISULTATO ATTESO:
-- ══════════════════════════════════════════════════════════════
-- | title                           | required_course_id | is_purchasable | price_cents | tipo                       |
-- |---------------------------------|--------------------|----------------|-------------|----------------------------|
-- | Sessione 1-on-1 VIP             | NULL               | true           | 19700       | 💰 EXTRA (Pagamento)       |
-- | 📄 Swipe Files Pro              | matrice-1          | false          | 0           | 🎁 BONUS (Gratis)          |
-- | 🔥 Framework Viralità           | matrice-1          | false          | 0           | 🎁 BONUS (Gratis)          |
-- | 📚 Template Storytelling        | matrice-1          | false          | 0           | 🎁 BONUS (Gratis)          |
-- | 🎙️ Masterclass AI Voice        | matrice-2          | false          | 0           | 🎁 BONUS (Gratis)          |
-- | 📝 10 Script AI Podcast         | matrice-2          | false          | 0           | 🎁 BONUS (Gratis)          |
