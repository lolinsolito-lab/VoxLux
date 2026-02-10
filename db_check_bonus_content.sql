-- ═══════════════════════════════════════════════════════════════
-- 🎁 AUDIT CONTENUTO BONUS & EXTRAS
-- ═══════════════════════════════════════════════════════════════

SELECT 
    title,
    is_purchasable as a_pagamento,
    delivery_type as tipo,
    content_url as link,
    action_label as bottone
FROM bonus_content
ORDER BY is_purchasable DESC, title;
