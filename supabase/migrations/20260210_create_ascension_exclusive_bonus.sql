-- ═══════════════════════════════════════════════════════════════
-- 🎁 BONUS ESCLUSIVO - Ascension Box Only
-- ═══════════════════════════════════════════════════════════════

-- CRIPTE VOCALI: Archivio segreto disponibile SOLO per chi possiede l'Ascension Box
INSERT INTO bonus_content (
    title, description, icon, delivery_type, content_url, action_label,
    is_visible, is_global_bonus, is_purchasable, price_cents, 
    required_course_id, order_index
)
SELECT
    '🔐 CRIPTE VOCALI - Archivio Esclusivo',
    'Archivio segreto con 50+ prompt AI per voice cloning, sound pack premium, voci clone esclusive e template avanzati. Accesso lifetime riservato ai membri Ascension.',
    '🔐',
    'download',
    'https://r2.voxlux.com/bonuses/ascension/cripte-vocali-master.zip',
    'ACCEDI CRIPTE',
    true, false, false, 0,
    'ascension-box', 0  -- Solo per Ascension Box
WHERE NOT EXISTS (
    SELECT 1 FROM bonus_content 
    WHERE title = '🔐 CRIPTE VOCALI - Archivio Esclusivo'
);

-- ═══════════════════════════════════════════════════════════════
-- VERIFICA: Struttura Bonus Finale
-- ═══════════════════════════════════════════════════════════════

SELECT 
    title,
    required_course_id,
    is_purchasable,
    CASE 
        WHEN required_course_id = 'matrice-1' THEN '📚 BONUS Storytelling'
        WHEN required_course_id = 'matrice-2' THEN '🎙️ BONUS Podcast'
        WHEN required_course_id = 'ascension-box' THEN '👑 BONUS Esclusivo Ascension'
        WHEN is_purchasable = true THEN '💰 EXTRA (Purchasable)'
        ELSE '⚠️ Errore configurazione'
    END as tipo
FROM bonus_content
ORDER BY 
    CASE 
        WHEN required_course_id = 'ascension-box' THEN 0
        WHEN required_course_id = 'matrice-1' THEN 1
        WHEN required_course_id = 'matrice-2' THEN 2
        WHEN is_purchasable = true THEN 3
    END,
    title;

-- ═══════════════════════════════════════════════════════════════
-- RISULTATO ATTESO:
-- ═══════════════════════════════════════════════════════════════
-- BONUS Storytelling (3):
-- - Swipe Files Pro
-- - Framework Viralità
-- - Template Storytelling
--
-- BONUS Podcast (3):
-- - Masterclass AI Voice
-- - Script AI Podcast
-- - [AGGIUNGI 1 BONUS PER ARRIVARE A 3]
--
-- BONUS Esclusivo Ascension (1):
-- - Cripte Vocali
--
-- EXTRA Purchasable (7):
-- - Sessione VIP (€297)
-- - Content Audit (€197)
-- - Voice Clone (€147)
-- - Viral Blueprint (€397)
-- - Masterclass Live (€497)
-- - Done-For-You (€797)
-- - Elite Inner Circle (€997)
