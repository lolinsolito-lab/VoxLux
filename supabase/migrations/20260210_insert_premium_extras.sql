-- ═══════════════════════════════════════════════════════════════
-- 💎 EXTRA PREMIUM - 7 Upsell Moderni High-Ticket
-- ═══════════════════════════════════════════════════════════════

-- Strategy: Basato su ricerca 2026 trends per coaching/content creator masterminds
-- Focus: Personalizzazione, AI tools, networking esclusivo, implementazione

-- 1️⃣ Sessione Strategica 1-on-1 VIP (CORE OFFER)
INSERT INTO bonus_content (
    title, description, icon, delivery_type, content_url, action_label,
    is_visible, is_global_bonus, is_purchasable, price_cents, order_index
) VALUES (
    '💎 Sessione Strategica 1-on-1 VIP',
    'Sessione privata di 90 minuti con il founder. Analisi strategica del brand, voce e posizionamento. Include registrazione + roadmap personalizzata.',
    '💎',
    'link',
    'https://calendly.com/voxlux/session-vip',
    'PRENOTA SESSIONE',
    true, false, true, 29700, 1
);

-- 2️⃣ Content Audit AI-Powered (NEW TREND 2026)
INSERT INTO bonus_content (
    title, description, icon, delivery_type, content_url, action_label,
    is_visible, is_global_bonus, is_purchasable, price_cents, order_index
) VALUES (
    '🤖 Content Audit AI-Powered',
    'Analisi completa del tuo profilo Instagram/TikTok/YouTube con AI. Ottieni report dettagliato con strategie per 10x engagement + piano editoriale 90 giorni.',
    '🤖',
    'download',
    'https://r2.voxlux.com/extras/content-audit-ai.pdf',
    'RICHIEDI AUDIT',
    true, false, true, 19700, 2
);

-- 3️⃣ Voice Clone Pro Package (AI TREND)
INSERT INTO bonus_content (
    title, description, icon, delivery_type, content_url, action_label,
    is_visible, is_global_bonus, is_purchasable, price_cents, order_index
) VALUES (
    '🎙️ Voice Clone Pro Package',
    'Setup completo del tuo clone vocale AI professionale. Include 3 voci (standard, energica, calma) + integrazione Eleven Labs + tutorial privato.',
    '🎙️',
    'link',
    'https://voxlux.com/voice-clone-setup',
    'CLONA VOCE',
    true, false, true, 14700, 3
);

-- 4️⃣ Viral Blueprint Accelerator (IMPLEMENTATION)
INSERT INTO bonus_content (
    title, description, icon, delivery_type, content_url, action_label,
    is_visible, is_global_bonus, is_purchasable, price_cents, order_index
) VALUES (
    '🚀 Viral Blueprint Accelerator',
    'Implementazione guidata per creare il tuo primo contenuto virale. Include 3 sessioni di follow-up, analisi real-time e ottimizzazioni live.',
    '🚀',
    'link',
    'https://calendly.com/voxlux/viral-blueprint',
    'INIZIA ACCELERATOR',
    true, false, true, 39700, 4
);

-- 5️⃣ Masterclass Live Annuale (NETWORKING PREMIUM)
INSERT INTO bonus_content (
    title, description, icon, delivery_type, content_url, action_label,
    is_visible, is_global_bonus, is_purchasable, price_cents, order_index
) VALUES (
    '🎯 Masterclass Live Annuale',
    'Accesso alle 12 masterclass live mensili con ospiti internazionali. Include Q&A, networking room e accesso alle registrazioni premium.',
    '🎯',
    'link',
    'https://voxlux.com/live-masterclass',
    'ACCEDI LIVE',
    true, false, true, 49700, 5
);

-- 6️⃣ Done-For-You Content Pack (HIGH-TICKET SERVICE)
INSERT INTO bonus_content (
    title, description, icon, delivery_type, content_url, action_label,
    is_visible, is_global_bonus, is_purchasable, price_cents, order_index
) VALUES (
    '✨ Done-For-You Content Pack',
    '30 contenuti professionali creati per te (script + voiceover + editing). Pronti da pubblicare. Include strategia personalizzata e calendario editoriale.',
    '✨',
    'link',
    'https://voxlux.com/dfy-content',
    'ORDINA PACK',
    true, false, true, 79700, 6
);

-- 7️⃣ Elite Inner Circle (COMMUNITY PREMIUM)
INSERT INTO bonus_content (
    title, description, icon, delivery_type, content_url, action_label,
    is_visible, is_global_bonus, is_purchasable, price_cents, order_index
) VALUES (
    '👑 Elite Inner Circle - Membership',
    'Accesso lifetime alla community esclusiva Elite Inner Circle. Include chat privata, eventi mensili, deal flow condiviso e revisioni portfolio.',
    '👑',
    'link',
    'https://voxlux.com/elite-circle',
    'RICHIEDI ACCESSO',
    true, false, true, 99700, 7
);

-- ═══════════════════════════════════════════════════════════════
-- VERIFICA FINALE
-- ═══════════════════════════════════════════════════════════════

SELECT 
    title,
    CONCAT('€', price_cents / 100) as prezzo,
    delivery_type,
    action_label,
    CASE 
        WHEN is_purchasable THEN '💰 EXTRA (Sempre a pagamento)'
        ELSE '🎁 BONUS (Gratis con corso)'
    END as tipo
FROM bonus_content
WHERE is_purchasable = true
ORDER BY price_cents ASC;

-- ═══════════════════════════════════════════════════════════════
-- RIEPILOGO PREZZI EXTRA:
-- ═══════════════════════════════════════════════════════════════
-- €147 - Voice Clone Pro Package (Entry-level tech)
-- €197 - Content Audit AI-Powered (Mid-tier analysis)
-- €297 - Sessione Strategica 1-on-1 VIP (Core consulting)
-- €397 - Viral Blueprint Accelerator (Implementation)
-- €497 - Masterclass Live Annuale (Networking)
-- €797 - Done-For-You Content Pack (High-ticket service)
-- €997 - Elite Inner Circle (Lifetime community)
