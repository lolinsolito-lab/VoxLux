import { Appointment, AppointmentType, AvailabilityRule, CalendarOverride } from './types';

export const generateAvailableSlots = (
    date: Date,
    type: AppointmentType,
    rules: AvailabilityRule[],
    overrides: CalendarOverride[],
    existingAppointments: Appointment[]
): string[] => {
    // 1. Get day of week (0=Sunday)
    const dayOfWeek = date.getDay();

    // 2. Find rule for this day
    const rule = rules.find(r => r.day_of_week === dayOfWeek && r.is_active);

    // 3. Check for blocking overrides
    const dayStr = date.toISOString().split('T')[0];
    const override = overrides.find(o => o.date === dayStr);

    if (override?.is_unavailable) return []; // Blocked by override
    if (!rule && !override) return []; // No rule and no specific enable override

    // 4. Determine start/end times
    // Priority: Override -> Rule -> Default (shouldn't happen if no rule)
    let startStr = override?.start_time || rule?.start_time || '09:00:00';
    let endStr = override?.end_time || rule?.end_time || '17:00:00';

    // Parse times to minutes
    const parseMinutes = (timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
    };

    let startMin = parseMinutes(startStr);
    let endMin = parseMinutes(endStr);
    const duration = type.duration_minutes;

    // 5. Generate potential slots
    const slots: string[] = [];

    // Iterate from start to end in 30min increments (or logic could be duration-based)
    // For "Flexible" logic, let's step by 30 mins, but check if 'duration' fits.
    for (let time = startMin; time + duration <= endMin; time += 30) {

        // Convert 'time' to HH:MM format for collision check
        const formatTime = (totalMin: number) => {
            const h = Math.floor(totalMin / 60);
            const m = totalMin % 60;
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        };

        const slotStart = formatTime(time);
        const slotEnd = formatTime(time + duration);

        // 6. Check collisions with existing appointments
        // We need to check if this specific slot overlaps with any appointment on this day
        const isBlocked = existingAppointments.some(app => {
            // Simplify: assume app.start_time is UTC ISO, we need local comparison or careful parsing
            // For MVP client-side, let's assume valid ISO comparisons on same day

            // Extract HH:MM from appointment ISO strings
            const appStart = new Date(app.start_time).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
            const appEnd = new Date(app.end_time).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

            // Overlap logic: (StartA < EndB) && (EndA > StartB)
            return (slotStart < appEnd) && (slotEnd > appStart);
        });

        if (!isBlocked) {
            slots.push(slotStart);
        }
    }

    return slots;
};
