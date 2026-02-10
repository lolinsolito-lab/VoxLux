
export interface AppointmentType {
    id: string;
    title: string;
    slug: string;
    description?: string;
    duration_minutes: number;
    price: number;
    is_active: boolean;
    color_theme: string;
}

export interface AvailabilityRule {
    id: string;
    day_of_week: number; // 0=Sunday
    start_time: string; // "09:00"
    end_time: string;   // "17:00"
    is_active: boolean;
}

export interface CalendarOverride {
    id: string;
    date: string; // "2024-12-25"
    is_unavailable: boolean;
    start_time?: string;
    end_time?: string;
    reason?: string;
}

export interface Appointment {
    id: string;
    user_id?: string;
    type_id: string;
    start_time: string; // ISO
    end_time: string;   // ISO
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
    client_name?: string;
    client_email?: string;
    client_notes?: string;
    meeting_url?: string;
    cancel_reason?: string;
    appointment_type?: AppointmentType; // Joined
}

export interface DaySlot {
    date: string;
    slots: {
        time: string;
        available: boolean;
    }[];
}
