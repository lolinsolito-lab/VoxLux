-- CALENDAR SYSTEM V1 (Flexible Rules)

-- 1. Appointment Types (e.g. "Discovery Call", "Coaching 1h")
CREATE TABLE public.appointment_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    price DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    color_theme TEXT DEFAULT '#8B5CF6', -- Purple default
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Availability Rules (Periodic availability)
CREATE TABLE public.availability_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 1=Monday...
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- 3. Calendar Overrides (Exceptions: holidays, sick days, or extra slots)
CREATE TABLE public.calendar_overrides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    is_unavailable BOOLEAN DEFAULT true, -- If true, blocks the whole day
    start_time TIME, -- If specific hours are added/removed
    end_time TIME,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Appointments (Actual bookings)
CREATE TABLE public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id), -- Nullable if guest booking (future proof)
    type_id UUID REFERENCES public.appointment_types(id) ON DELETE RESTRICT,
    
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
    
    client_name TEXT, -- Snapshot in case user changes or is guest
    client_email TEXT,
    client_notes TEXT,
    
    meeting_url TEXT, -- Zoom/Google Meet link
    meeting_provider TEXT DEFAULT 'zoom',
    
    cancel_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_appointments_range ON public.appointments USING gist (tsrange(start_time, end_time));
CREATE INDEX idx_appointments_user ON public.appointments(user_id);
CREATE INDEX idx_appointments_status ON public.appointments(status);

-- RLS Policies
ALTER TABLE public.appointment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Public read access for types and availability (needed for booking UI)
CREATE POLICY "Public types read" ON public.appointment_types FOR SELECT USING (true);
CREATE POLICY "Public availability read" ON public.availability_rules FOR SELECT USING (true);
CREATE POLICY "Public overrides read" ON public.calendar_overrides FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "Admin full access types" ON public.appointment_types FOR ALL USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'michael@voxlux.strategy')); -- Replace with real admin check or role
CREATE POLICY "Admin full access rules" ON public.availability_rules FOR ALL USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'michael@voxlux.strategy'));
CREATE POLICY "Admin full access appointments" ON public.appointments FOR ALL USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'michael@voxlux.strategy'));

-- Users can read/create their own appointments
CREATE POLICY "User read own appointments" ON public.appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User create own appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- SEED DEFAULT DATA
INSERT INTO public.appointment_types (title, slug, duration_minutes, price, description) VALUES
('Discovery Call', 'discovery-call', 30, 0, 'Chiamata conoscitiva gratuita per valutare il percorso.'),
('Sessione Strategica', 'strategy-session', 60, 250, 'Sessione intensiva di sblocco e strategia.'),
('Check-up Mensile', 'monthly-checkup', 45, 0, 'Analisi dei progressi per membri attivi.');

-- Default Rules: Mon-Fri, 10:00-18:00
INSERT INTO public.availability_rules (day_of_week, start_time, end_time) VALUES
(1, '10:00', '18:00'), -- Mon
(2, '10:00', '18:00'), -- Tue
(3, '10:00', '18:00'), -- Wed
(4, '10:00', '18:00'), -- Thu
(5, '10:00', '13:00'); -- Fri (Half day)

NOTIFY pgrst, 'reload config';
