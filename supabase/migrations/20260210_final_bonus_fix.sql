-- ═══════════════════════════════════════════════════════════════
-- 🔧 FIX FINALE: Bonus Gratis vs Extra Purchasable
-- ═══════════════════════════════════════════════════════════════

-- STEP 1: Rimuovi duplicato Sessione VIP (tieni solo la nuova a €297)
DELETE FROM bonus_content
WHERE title = 'Sessione 1-on-1 VIP' 
AND price_cents = 19700;  -- Elimina la vecchia a €197

-- STEP 2: Template Storytelling → BONUS Gratis (Matrice I)
UPDATE bonus_content
SET 
    required_course_id = 'matrice-1',
    is_purchasable = false,
    price_cents = 0
WHERE title = 'Template Storytelling Esclusivi';

-- STEP 3: 10 Script AI Podcast → BONUS Gratis (Matrice II)
UPDATE bonus_content
SET 
    required_course_id = 'matrice-2',
    is_purchasable = false,
    price_cents = 0
WHERE title = '10 Script AI Podcast';

-- STEP 4: Aggiungi 3° bonus per Matrice II (se manca)
INSERT INTO bonus_content (
    title, description, icon, delivery_type, content_url, action_label,
    is_visible, is_global_bonus, is_purchasable, price_cents,
    required_course_id, order_index
)
SELECT 
    '🎧 Sound Pack Pro Edition',
    'Libreria di 100+ effetti sonori premium, musiche royalty-free e intro/outro professionali per i tuoi podcast.',
    '🎧',
    'download',
    'https://r2.voxlux.com/bonuses/sound-pack-pro.zip',
    'SCARICA PACK',
    true, false, false, 0,
    'matrice-2', 10
WHERE NOT EXISTS (
    SELECT 1 FROM bonus_content 
    WHERE title = '🎧 Sound Pack Pro Edition'
);

-- ═══════════════════════════════════════════════════════════════
-- VERIFICA COMPLETA
-- ═══════════════════════════════════════════════════════════════

SELECT 
    title,
    CONCAT('€', price_cents / 100) as prezzo,
    required_course_id as corso,
    CASE 
        WHEN required_course_id = 'matrice-1' AND NOT is_purchasable THEN '🎓 BONUS Storytelling (Gratis)'
        WHEN required_course_id = 'matrice-2' AND NOT is_purchasable THEN '🎙️ BONUS Podcast (Gratis)'
        WHEN required_course_id = 'ascension-box' AND NOT is_purchasable THEN '👑 BONUS Ascension (Gratis)'
        WHEN is_purchasable THEN '💰 EXTRA (Purchasable)'
        ELSE '⚠️ ERRORE'
    END as tipo
FROM bonus_content
ORDER BY 
    CASE 
        WHEN required_course_id IS NOT NULL THEN 0
        ELSE 1
    END,
    required_course_id,
    title;

-- ═══════════════════════════════════════════════════════════════
-- RISULTATO ATTESO (13 totali):
-- ═══════════════════════════════════════════════════════════════
-- 🎓 BONUS Storytelling (3):
--   - 📄 Swipe Files Pro Edition
--   - 🔥 Framework Viralità Garantita
--   - 📚 Template Storytelling Esclusivi
--
-- 🎙️ BONUS Podcast (3):
--   - 🎙️ Masterclass: AI Voice Cloning
--   - 📝 10 Script AI Podcast
--   - 🎧 Sound Pack Pro Edition (NUOVO)
--
-- 👑 BONUS Ascension (1):
--   - 🔐 CRIPTE VOCALI
--
-- 💰 EXTRA Purchasable (7):
--   - 🎙️ Voice Clone Pro Package (€147)
--   - 🤖 Content Audit AI-Powered (€197)
--   - 💎 Sessione Strategica 1-on-1 VIP (€297)
--   - 🚀 Viral Blueprint Accelerator (€397)
--   - 🎯 Masterclass Live Annuale (€497)
--   - ✨ Done-For-You Content Pack (€797)
--   - 👑 Elite Inner Circle (€997)
