import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Settings, Users, CheckCircle, XCircle, ChevronLeft, ChevronRight, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../services/supabase';
import { AppointmentType, AvailabilityRule, Appointment } from '../../services/calendar/types';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths, isBefore, startOfToday, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';

// --- CONFIGURATION COMPONENTS ---

const AppointmentTypeCard = ({ type, onEdit, onDelete }: { type: AppointmentType; onEdit: (t: AppointmentType) => void; onDelete: (id: string) => void }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-purple-500/30 transition-all group">
        <div className="flex justify-between items-start mb-3">
            <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]`} style={{ color: type.color_theme, backgroundColor: type.color_theme }} />
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(type)} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"><Edit2 size={14} /></button>
                <button onClick={() => onDelete(type.id)} className="p-1.5 hover:bg-white/10 rounded-lg text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
            </div>
        </div>
        <h3 className="font-bold text-lg mb-1">{type.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{type.description || 'Nessuna descrizione'}</p>
        <div className="flex items-center gap-4 text-xs font-semibold text-gray-300">
            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                <Clock size={12} />
                {type.duration_minutes} min
            </div>
            <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 px-2 py-1 rounded text-emerald-400 border border-emerald-500/30">
                {type.price === 0 ? 'GRATIS' : `€${type.price}`}
            </div>
        </div>
    </div>
);

const DayScheduleRow = ({ day, rule, onUpdate }: { day: string; rule?: AvailabilityRule; onUpdate: (start: string, end: string, active: boolean) => void }) => {
    return (
        <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] px-4 rounded-lg transition-colors">
            <div className="flex items-center gap-4 w-1/4">
                <div className={`w-10 h-6 rounded-full relative transition-colors cursor-pointer ${rule?.is_active ? 'bg-purple-600' : 'bg-gray-700'}`} onClick={() => onUpdate(rule?.start_time || '09:00', rule?.end_time || '17:00', !rule?.is_active)}>
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${rule?.is_active ? 'translate-x-4' : ''}`} />
                </div>
                <span className={`font-semibold ${rule?.is_active ? 'text-white' : 'text-gray-500'}`}>{day}</span>
            </div>

            {rule?.is_active ? (
                <div className="flex items-center gap-3">
                    <input
                        type="time"
                        value={rule.start_time.slice(0, 5)}
                        onChange={(e) => onUpdate(e.target.value, rule.end_time, true)}
                        className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none w-24 text-center"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                        type="time"
                        value={rule.end_time.slice(0, 5)}
                        onChange={(e) => onUpdate(rule.start_time, e.target.value, true)}
                        className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none w-24 text-center"
                    />
                </div>
            ) : (
                <span className="text-gray-600 text-sm italic pr-12">Non disponibile</span>
            )}
        </div>
    );
};

// --- CALENDAR VIEW COMPONENT ---

const CalendarView = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        fetchAppointments();
        const channel = supabase.channel('admin_calendar')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, fetchAppointments)
            .subscribe();
        return () => { channel.unsubscribe(); };
    }, [currentMonth]);

    const fetchAppointments = async () => {
        const start = startOfMonth(currentMonth).toISOString();
        const end = endOfMonth(currentMonth).toISOString();
        const { data } = await supabase.from('appointments').select(`*, appointment_types(title, color_theme, duration_minutes)`).gte('start_time', start).lte('end_time', end);
        if (data) setAppointments(data);
    };

    const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
    const getDayAppointments = (date: Date) => appointments.filter(app => isSameDay(parseISO(app.start_time), date));

    const updateStatus = async (id: string, status: string) => {
        await supabase.from('appointments').update({ status }).eq('id', id);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            <div className="lg:col-span-2 bg-black/20 rounded-xl p-6 border border-white/5 h-fit">
                <div className="flex justify-between items-center mb-8">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white/10 rounded-full"><ChevronLeft /></button>
                    <h2 className="text-2xl font-bold capitalize">{format(currentMonth, 'MMMM yyyy', { locale: it })}</h2>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white/10 rounded-full"><ChevronRight /></button>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-4">{['Do', 'Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa'].map(d => <div key={d} className="text-center text-xs font-bold text-gray-500 uppercase">{d}</div>)}</div>
                <div className="grid grid-cols-7 gap-2">
                    {days.map((day) => {
                        const dayApps = getDayAppointments(day);
                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                        return (
                            <button key={day.toISOString()} onClick={() => setSelectedDate(day)} className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all group ${isSelected ? 'bg-purple-600 text-white shadow-lg scale-105 z-10' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}>
                                <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{format(day, 'd')}</span>
                                <div className="flex gap-1 mt-1">
                                    {dayApps.slice(0, 3).map((app) => (
                                        <div key={app.id} className={`w-1.5 h-1.5 rounded-full ${app.status === 'confirmed' ? 'bg-green-400' : app.status === 'pending' ? 'bg-amber-400' : 'bg-gray-500'}`} />
                                    ))}
                                    {dayApps.length > 3 && <div className="w-1.5 h-1.5 rounded-full bg-gray-400">+</div>}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="lg:col-span-1 bg-black/40 rounded-xl p-6 border border-white/10 h-full overflow-y-auto">
                <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">{selectedDate ? format(selectedDate, 'EEEE d MMMM', { locale: it }) : 'Seleziona una data'}</h3>
                {selectedDate && (
                    <div className="space-y-4">
                        {getDayAppointments(selectedDate).length === 0 ? <div className="text-gray-500 text-center py-10">Nessun appuntamento</div> : getDayAppointments(selectedDate).map(app => (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={app.id} className="bg-white/5 border border-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${app.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : app.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>{app.status}</span>
                                    <span className="text-sm font-mono text-gray-400">{format(parseISO(app.start_time), 'HH:mm')}</span>
                                </div>
                                <h4 className="font-bold text-white mb-1">{app.client_name}</h4>
                                <p className="text-sm text-purple-400 mb-2">{(app as any).appointment_types?.title}</p>
                                {app.client_notes && <p className="text-xs text-gray-500 italic mb-4 bg-black/20 p-2 rounded">"{app.client_notes}"</p>}
                                <div className="flex gap-2 mt-2">
                                    {app.status === 'pending' && (<><button onClick={() => updateStatus(app.id, 'confirmed')} className="flex-1 bg-green-600/20 hover:bg-green-600/40 text-green-400 py-1.5 rounded text-xs font-bold transition-colors flex items-center justify-center gap-1"><CheckCircle size={12} /> Accetta</button><button onClick={() => updateStatus(app.id, 'cancelled')} className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 py-1.5 rounded text-xs font-bold transition-colors flex items-center justify-center gap-1"><XCircle size={12} /> Rifiuta</button></>)}
                                    {app.status === 'confirmed' && <button onClick={() => updateStatus(app.id, 'completed')} className="flex-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 py-1.5 rounded text-xs font-bold transition-colors">Segna Completato</button>}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

export const AdminCalendar: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'calendar' | 'bookings' | 'config'>('calendar');
    const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
    const [availabilityRules, setAvailabilityRules] = useState<AvailabilityRule[]>([]);

    // Modal State
    const [showTypeModal, setShowTypeModal] = useState(false);
    const [editingType, setEditingType] = useState<AppointmentType | null>(null);

    useEffect(() => {
        fetchConfigData();
        const channel = supabase.channel('calendar_config')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'appointment_types' }, fetchConfigData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'availability_rules' }, fetchConfigData)
            .subscribe();
        return () => { channel.unsubscribe(); };
    }, []);

    const fetchConfigData = async () => {
        const [typesRes, rulesRes] = await Promise.all([
            supabase.from('appointment_types').select('*').order('created_at'),
            supabase.from('availability_rules').select('*').order('day_of_week')
        ]);
        if (typesRes.data) setAppointmentTypes(typesRes.data);
        if (rulesRes.data) setAvailabilityRules(rulesRes.data);
    };

    const handleUpdateRule = async (dayIndex: number, start: string, end: string, active: boolean) => {
        const existingRule = availabilityRules.find(r => r.day_of_week === dayIndex);
        if (existingRule) {
            await supabase.from('availability_rules').update({ start_time: start, end_time: end, is_active: active }).eq('id', existingRule.id);
        } else {
            await supabase.from('availability_rules').insert({ day_of_week: dayIndex, start_time: start, end_time: end, is_active: active });
        }
    };

    const handleDeleteType = async (id: string) => {
        if (confirm('Eliminare questo tipo di appuntamento?')) {
            await supabase.from('appointment_types').delete().eq('id', id);
        }
    };

    const WeekDays = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

    return (
        <div className="min-h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 md:p-8 pb-20">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">CALENDAR <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">MANAGER</span></h1>
                    <p className="text-gray-400 text-lg">Gestione Appuntamenti e Disponibilità</p>
                </div>
            </motion.div>

            <div className="flex gap-4 mb-8 border-b border-white/10 pb-1">
                {[{ id: 'calendar', label: 'Calendario', icon: CalendarIcon }, { id: 'bookings', label: 'Prenotazioni', icon: Users }, { id: 'config', label: 'Configurazione', icon: Settings }].map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider transition-all relative flex items-center gap-2 ${activeTab === tab.id ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}>
                        <tab.icon size={18} /> {tab.label}
                        {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-purple-400" />}
                    </button>
                ))}
            </div>

            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white/5 border border-white/10 rounded-2xl min-h-[600px] backdrop-blur-sm p-8">
                {activeTab === 'config' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="flex justify-between items-center"><h2 className="text-2xl font-bold">Tipi Sessione</h2><button onClick={() => { setEditingType(null); setShowTypeModal(true); }} className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"><Plus size={20} /></button></div>
                            <div className="space-y-4">{appointmentTypes.map(type => <AppointmentTypeCard key={type.id} type={type} onEdit={(t) => { setEditingType(t); setShowTypeModal(true); }} onDelete={handleDeleteType} />)}</div>
                        </div>
                        <div className="lg:col-span-2 bg-black/20 rounded-xl p-6 border border-white/5">
                            <h2 className="text-2xl font-bold mb-6">Orari Settimanali Standard</h2>
                            <div className="space-y-2">{WeekDays.map((day, index) => <DayScheduleRow key={day} day={day} rule={availabilityRules.find(r => r.day_of_week === index)} onUpdate={(start, end, active) => handleUpdateRule(index, start, end, active)} />)}</div>
                        </div>
                    </div>
                )}
                {activeTab === 'calendar' && <CalendarView />}
                {activeTab === 'bookings' && <div className="text-center py-20 text-gray-400">Usa la vista Calendario per vedere tutte le prenotazioni.</div>}
            </motion.div>

            <AnimatePresence>
                {showTypeModal && <TypeFormModal type={editingType} onClose={() => setShowTypeModal(false)} onSave={fetchConfigData} />}
            </AnimatePresence>
        </div>
    );
};

const TypeFormModal = ({ type, onClose, onSave }: { type: AppointmentType | null, onClose: () => void, onSave: () => void }) => {
    const [form, setForm] = useState({ title: type?.title || '', description: type?.description || '', duration_minutes: type?.duration_minutes || 60, price: type?.price || 0, slug: type?.slug || '', color_theme: type?.color_theme || '#8B5CF6' });
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        try {
            if (type) await supabase.from('appointment_types').update({ ...form, slug }).eq('id', type.id);
            else await supabase.from('appointment_types').insert({ ...form, slug });
            onSave(); onClose();
        } catch (error) { alert('Errore salvataggio'); }
    };
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl max-h-[100dvh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6">{type ? 'Modifica Sessione' : 'Nuova Sessione'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Titolo</label><input required type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 mt-1 focus:border-purple-500 outline-none" placeholder="es. Coaching 1h" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-gray-500 uppercase">Durata (min)</label><input required type="number" value={form.duration_minutes} onChange={e => setForm(f => ({ ...f, duration_minutes: parseInt(e.target.value) }))} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 mt-1 focus:border-purple-500 outline-none" /></div>
                        <div><label className="text-xs font-bold text-gray-500 uppercase">Prezzo (€)</label><input required type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) }))} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 mt-1 focus:border-purple-500 outline-none" /></div>
                    </div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Descrizione</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 mt-1 focus:border-purple-500 outline-none h-24 resize-none" /></div>
                    <div className="flex gap-2 mt-2">{['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'].map(color => <button type="button" key={color} onClick={() => setForm(f => ({ ...f, color_theme: color }))} className={`w-8 h-8 rounded-full border-2 transition-all ${form.color_theme === color ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`} style={{ backgroundColor: color }} />)}</div>
                    <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-xl font-bold mt-4 transition-colors">Salva Sessione</button>
                </form>
            </div>
        </motion.div>
    );
};
