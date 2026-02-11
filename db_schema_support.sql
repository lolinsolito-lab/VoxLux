-- SUPPORT SYSTEM SCHEMA
-- Tickets and Real-Time Chat

-- 1. TICKETS TABLE
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    category TEXT DEFAULT 'general', -- 'billing', 'technical', 'content', 'general'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_reply_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MESSAGES TABLE (Chat)
CREATE TABLE IF NOT EXISTS public.support_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL if system message
    message TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT false, -- True if sent by admin/support
    read_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_tickets_user ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_messages_ticket ON public.support_messages(ticket_id);

-- RLS POLICIES
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- ADMIN POLICIES (Full Access)
CREATE POLICY "Admin Full Access Tickets" ON public.support_tickets
FOR ALL TO authenticated
USING (
    (current_setting('request.jwt.claims', true)::jsonb ->> 'email') ILIKE '%@voxlux.strategy' 
    OR (current_setting('request.jwt.claims', true)::jsonb ->> 'email') = 'michael@voxlux.strategy'
    OR (current_setting('request.jwt.claims', true)::jsonb ->> 'email') = 'admin@insolito.dev'
    OR (current_setting('request.jwt.claims', true)::jsonb ->> 'email') = 'jaramichael@hotmail.com'
);

CREATE POLICY "Admin Full Access Messages" ON public.support_messages
FOR ALL TO authenticated
USING (
    (current_setting('request.jwt.claims', true)::jsonb ->> 'email') ILIKE '%@voxlux.strategy' 
    OR (current_setting('request.jwt.claims', true)::jsonb ->> 'email') = 'michael@voxlux.strategy'
    OR (current_setting('request.jwt.claims', true)::jsonb ->> 'email') = 'admin@insolito.dev'
    OR (current_setting('request.jwt.claims', true)::jsonb ->> 'email') = 'jaramichael@hotmail.com'
);

-- USER POLICIES (Own Data Only)
CREATE POLICY "User View Own Tickets" ON public.support_tickets
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "User Create Own Tickets" ON public.support_tickets
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User View Own Messages" ON public.support_messages
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.support_tickets 
        WHERE id = ticket_id AND user_id = auth.uid()
    )
);

CREATE POLICY "User Send Messages" ON public.support_messages
FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.support_tickets 
        WHERE id = ticket_id AND user_id = auth.uid()
    )
    AND is_admin = false -- Users cannot impersonate admins
);

-- REALTIME
-- Enable realtime for both tables so chat updates instantly
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;
