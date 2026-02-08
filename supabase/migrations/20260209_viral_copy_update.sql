-- ═══════════════════════════════════════════════════════════════
-- 🎯 VIRAL COPY OPTIMIZATION - Extra Premium Cards
-- Migration: 20260209_viral_copy_update.sql
-- Descrizione: Update copy con tecniche storyselling per max conversioni
-- ═══════════════════════════════════════════════════════════════

-- Update Masterclass: AI Voice Cloning Premium
UPDATE public.bonus_content
SET 
    title = '🎙️ Masterclass: AI Voice Cloning',
    description = 'Clona la tua voce in 5 minuti e crea contenuti vocali illimitati. Lo strumento che i top creator usano per scalare senza registrare ogni volta.',
    icon = '🎙️'
WHERE title LIKE '%AI Voice Cloning%' OR title LIKE '%Masterclass%Voice%';

-- Update Strategia Virale Avanzata
UPDATE public.bonus_content
SET 
    title = '🔥 Framework Viralità Garantita',
    description = 'Il metodo step-by-step che porta i tuoi contenuti a 100K+ views in 48h. Include casi studio reali e le 7 leve psicologiche che attivano la condivisione.',
    icon = '🔥'
WHERE title LIKE '%Strategia Virale%' OR title LIKE '%Virale%';

-- Update Template Swipe Files (se esiste)
UPDATE public.bonus_content
SET 
    title = '📄 Swipe Files Pro Edition',
    description = '127 template pronti da copiare-incollare per Instagram, TikTok, YouTube. Gli stessi template che hanno generato 50M+ views combinati.',
    icon = '📄'
WHERE title LIKE '%Template%' OR title LIKE '%Swipe%';

-- Update Sessione Strategica 1-1 (se esiste)
UPDATE public.bonus_content
SET 
    title = '🎯 Sessione Strategica VIP',
    description = 'Analisi 1-on-1 del tuo brand + piano 90 giorni per 10x la reach. Solo 3 slot al mese. Investimento che si ripaga in una settimana.',
    icon = '🎯'
WHERE title LIKE '%Sessione%' OR title LIKE '%1-1%' OR title LIKE '%Strategica%';

COMMENT ON TABLE public.bonus_content IS 'Viral copy optimized for max conversions - Updated 2026-02-08';
