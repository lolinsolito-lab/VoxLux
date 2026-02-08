-- ═══════════════════════════════════════════════════════════════
-- 🔒 SECURITY LOCKDOWN - Admin Tables Protection
-- Migration: 20260208_security_lockdown.sql
-- Descrizione: Attiva RLS su admin_sessions e admin_users
--              SOLO l'admin può accedere (jaramichael@hotmail.com)
-- ═══════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────┐
-- │ 1. ATTIVA RLS su admin_sessions                              │
-- └─────────────────────────────────────────────────────────────┘

ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Solo l'admin principale può visualizzare sessioni
CREATE POLICY "Only super admin can view sessions"
ON public.admin_sessions FOR SELECT
TO authenticated
USING (
    auth.jwt() ->> 'email' = 'jaramichael@hotmail.com'
);

-- Solo l'admin principale può creare sessioni
CREATE POLICY "Only super admin can create sessions"
ON public.admin_sessions FOR INSERT
TO authenticated
WITH CHECK (
    auth.jwt() ->> 'email' = 'jaramichael@hotmail.com'
);

-- Solo l'admin principale può modificare sessioni
CREATE POLICY "Only super admin can modify sessions"
ON public.admin_sessions FOR UPDATE
TO authenticated
USING (
    auth.jwt() ->> 'email' = 'jaramichael@hotmail.com'
);

-- Solo l'admin principale può eliminare sessioni
CREATE POLICY "Only super admin can delete sessions"
ON public.admin_sessions FOR DELETE
TO authenticated
USING (
    auth.jwt() ->> 'email' = 'jaramichael@hotmail.com'
);

-- ┌─────────────────────────────────────────────────────────────┐
-- │ 2. ATTIVA RLS su admin_users                                 │
-- └─────────────────────────────────────────────────────────────┘

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- SOLO l'admin principale può vedere admin_users
CREATE POLICY "Only super admin can view admin_users"
ON public.admin_users FOR SELECT
TO authenticated
USING (
    auth.jwt() ->> 'email' = 'jaramichael@hotmail.com'
);

-- SOLO l'admin principale può modificare admin_users
CREATE POLICY "Only super admin can modify admin_users"
ON public.admin_users FOR ALL
TO authenticated
USING (
    auth.jwt() ->> 'email' = 'jaramichael@hotmail.com'
);

-- ┌─────────────────────────────────────────────────────────────┐
-- │ 3. FIX BONUS "Coaching 1-1" (No Access Rule)                │
-- └─────────────────────────────────────────────────────────────┘

-- Rendiamo "Coaching 1-1" un bonus globale (visibile a tutti)
UPDATE public.bonus_content
SET is_global_bonus = true
WHERE title = 'Coaching 1-1';

-- ┌─────────────────────────────────────────────────────────────┐
-- │ 4. COMMENTI DI SICUREZZA                                     │
-- └─────────────────────────────────────────────────────────────┘

COMMENT ON TABLE public.admin_sessions IS '🔒 SUPER PROTECTED: Only jaramichael@hotmail.com can access';
COMMENT ON TABLE public.admin_users IS '🔒 SUPER PROTECTED: Only jaramichael@hotmail.com can access';

-- ═══════════════════════════════════════════════════════════════
-- ✅ SECURITY LOCKDOWN COMPLETATO
-- Esegui questa migration per proteggere totalmente le tabelle admin
-- ═══════════════════════════════════════════════════════════════
