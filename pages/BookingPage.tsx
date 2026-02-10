import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths, isBefore, startOfToday } from 'date-fns';
import { it } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../services/supabase';
import { AppointmentType, AvailabilityRule, Appointment } from '../services/calendar/types';
import { generateAvailableSlots } from '../services/calendar/slotGenerator';
import { useNavigate } from 'react-router-dom';

/**
 * VOX LUX BOOKING ENGINE
 * A premium, step-by-step booking experience.
 */
export const BookingPage: React.FC = () => {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1:Type, 2:Date, 3:Time, 4:Form
    const [loading, setLoading] = useState(true);

    // Data
    const [types, setTypes] = useState<AppointmentType[]>([]);
    const [rules, setRules] = useState<AvailabilityRule[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    // Selection
    const [selectedType, setSelectedType] = useState<AppointmentType | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Form
    const [formData, setFormData] = useState({ name: '', email: '', notes: '' });

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const [t, r, a] = await Promise.all([
            supabase.from('appointment_types').select('*').eq('is_active', true),
            supabase.from('availability_rules').select('*').eq('is_active', true),
            supabase.from('appointments').select('*').gte('start_time', new Date().toISOString()) // Future apps only
        ]);
        if (t.data) setTypes(t.data);
        if (r.data) setRules(r.data);
        if (a.data) setAppointments(a.data);
        setLoading(false);
    };

    // --- STEPS RENDERERS ---

    const renderTypeSelection = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {types.map((type) => (
                <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedType(type); setStep(2); }}
                    className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 text-left hover:border-amber-500/50 hover:bg-white/10 transition-all overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:to-amber-500/10 transition-all" />
                    <div className={`w-12 h-12 rounded-full mb-6 flex items-center justify-center text-xl font-bold bg-gradient-to-br from-gray-800 to-black border border-white/10 shadow-lg`} style={{ color: type.color_theme }}>
                        {type.title.charAt(0)}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 ml-1">{type.title}</h3>
                    <p className="text-gray-400 text-sm mb-6 ml-1 h-10 line-clamp-2">{type.description}</p>
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-300 ml-1">
                        <span className="flex items-center gap-1"><Clock size={14} /> {type.duration_minutes} min</span>
                        <span className="text-amber-400">{type.price === 0 ? 'GRATIS' : `€${type.price}`}</span>
                    </div>
                </motion.button>
            ))}
        </div>
    );

    const renderCalendar = () => {
        const days = eachDayOfInterval({
            start: startOfMonth(currentMonth),
            end: endOfMonth(currentMonth),
        });

        return (
            <div className="max-w-md mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex justify-between items-center mb-8">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white/10 rounded-full"><ChevronLeft /></button>
                    <h3 className="text-xl font-bold capitalize">{format(currentMonth, 'MMMM yyyy', { locale: it })}</h3>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white/10 rounded-full"><ChevronRight /></button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Do', 'Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa'].map(d => <div key={d} className="text-center text-xs font-bold text-gray-500">{d}</div>)}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {days.map((day) => {
                        const isPast = isBefore(day, startOfToday());
                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                        const isCurrentMonth = isSameMonth(day, currentMonth);

                        return (
                            <button
                                key={day.toISOString()}
                                disabled={isPast || !isCurrentMonth}
                                onClick={() => { setSelectedDate(day); setStep(3); }}
                                className={`
                            aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all
                            ${!isCurrentMonth ? 'opacity-0 pointer-events-none' : ''}
                            ${isSelected ? 'bg-amber-500 text-black font-bold shadow-lg scale-110 z-10' : 'bg-white/5 hover:bg-white/20 text-gray-300'}
                            ${isPast ? 'opacity-20 cursor-not-allowed' : ''}
                        `}
                            >
                                {format(day, 'd')}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderSlots = () => {
        if (!selectedType || !selectedDate) return null;

        // In real app, passes overrides and existing bookings from fetched data
        const slots = generateAvailableSlots(selectedDate, selectedType, rules, [], appointments);

        return (
            <div className="max-w-md mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
                <h3 className="text-xl font-bold mb-6 text-center capitalize">
                    {format(selectedDate, 'EEEE d MMMM', { locale: it })}
                </h3>
                {slots.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">Nessuna disponibilità per questa data.</div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {slots.map(time => (
                            <button
                                key={time}
                                onClick={() => { setSelectedTime(time); setStep(4); }}
                                className="bg-white/5 hover:bg-amber-500 hover:text-black border border-white/10 hover:border-amber-500 rounded-lg py-3 font-mono transition-all"
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderForm = () => {
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);
            // Build Date Objects
            if (!selectedDate || !selectedTime || !selectedType) return;

            const [hours, minutes] = selectedTime.split(':').map(Number);
            const start = new Date(selectedDate);
            start.setHours(hours, minutes, 0);

            const end = new Date(start);
            end.setMinutes(start.getMinutes() + selectedType.duration_minutes);

            // Save
            const { error } = await supabase.from('appointments').insert({
                type_id: selectedType.id,
                start_time: start.toISOString(),
                end_time: end.toISOString(),
                status: 'pending',
                client_name: formData.name,
                client_email: formData.email,
                client_notes: formData.notes
            });

            if (error) {
                alert('Errore prenotazione: ' + error.message);
                setLoading(false);
            } else {
                alert('Prenotazione confermata!');
                navigate('/dashboard'); // Or confirmation page
            }
        };

        return (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500 bg-white/5 border border-white/10 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6">Completa Prenotazione</h3>

                <div className="space-y-4 mb-8">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo</label>
                        <input required type="text" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-amber-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                        <input required type="email" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-amber-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Note (Opzionale)</label>
                        <textarea value={formData.notes} onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-amber-500 h-24 resize-none" />
                    </div>
                </div>

                <button disabled={loading} type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                    {loading ? 'Attendere...' : <>CONFERMA PRENOTAZIONE <ArrowRight size={20} /></>}
                </button>
            </form>
        );
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-500 selection:text-black">
            {/* HEADER */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 p-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="font-black text-xl tracking-tighter">VOX LUX <span className="text-amber-500">BOOKING</span></div>
                    {step > 1 && (
                        <button onClick={() => setStep(s => Math.max(1, s - 1) as any)} className="text-sm font-bold text-gray-400 hover:text-white flex items-center gap-1">
                            <ChevronLeft size={16} /> INDIETRO
                        </button>
                    )}
                </div>
            </header>

            {/* PROGRESS BAR */}
            <div className="fixed top-[65px] left-0 h-1 bg-amber-500 transition-all duration-500 z-50" style={{ width: `${(step / 4) * 100}%` }} />

            <main className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
                        {step === 1 && "Start Your Journey"}
                        {step === 2 && "Select a Date"}
                        {step === 3 && "Select a Time"}
                        {step === 4 && "Finalize"}
                    </h1>
                    <p className="text-gray-400 text-lg">
                        {step === 1 && "Scegli il tipo di sessione strategica più adatta a te."}
                        {step === 2 && "Tutti gli orari sono nel tuo fuso orario locale."}
                        {step === 3 && `Disponibilità per ${selectedDate ? format(selectedDate, 'EEEE d MMMM', { locale: it }) : ''}`}
                        {step === 4 && "Ci siamo quasi. Inserisci i tuoi dati per ricevere il link Zoom."}
                    </p>
                </div>

                {step === 1 && renderTypeSelection()}
                {step === 2 && renderCalendar()}
                {step === 3 && renderSlots()}
                {step === 4 && renderForm()}

            </main>
        </div>
    );
};
