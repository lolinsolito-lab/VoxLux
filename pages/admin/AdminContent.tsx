import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Gift, ShoppingBag, ExternalLink, FileText, Video, Music, RefreshCw, X, Check, TrendingUp, DollarSign, Zap, Eye, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../services/supabase';
import { ContentPreviewModal } from '../../components/admin/ContentPreviewModal';
import { restoreCourses } from '../../services/admin/restoreCourseData';

// Unified Interface based on bonus_content table
interface BonusContent {
    id: string;
    title: string;
    description: string;
    icon: string;
    delivery_type: string;
    content_url: string;
    action_label: string;
    is_visible: boolean; // mapped from active
    is_purchasable: boolean; // defines if it's Bonus or Upsell
    price_cents: number;
    required_course_id: string | null; // For bonuses
    stripe_price_id?: string; // For upsells
    is_global_bonus: boolean;
    order_index: number;
    badge?: string; // For upsells
}

const BonusFormModal = ({ bonus, onClose, onSave }: { bonus: BonusContent | null; onClose: () => void; onSave: () => void }) => {
    const [form, setForm] = useState({
        title: bonus?.title || '',
        description: bonus?.description || '',
        required_course_id: bonus?.required_course_id || '',
        is_global_bonus: bonus?.is_global_bonus || false,
        delivery_type: bonus?.delivery_type || 'link',
        content_url: bonus?.content_url || '',
        action_label: bonus?.action_label || 'ACCEDI',
        is_visible: bonus?.is_visible ?? true,
        icon: bonus?.icon || '🎁',
        is_purchasable: false, // Always false for Bonuses tab
        price_cents: 0,
        order_index: bonus?.order_index || 0
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (bonus) {
                await supabase.from('bonus_content').update(form).eq('id', bonus.id);
            } else {
                await supabase.from('bonus_content').insert(form);
            }
            onSave();
        } catch (error) {
            console.error('Error saving bonus:', error);
            alert('Errore nel salvataggio');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[100dvh] md:max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {bonus ? <Pencil size={20} className="text-purple-500" /> : <Plus size={20} className="text-purple-500" />}
                        {bonus ? 'Modifica Bonus' : 'Nuovo Bonus'}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block font-semibold">Titolo</label>
                            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-all" required />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block font-semibold">Icona (Emoji)</label>
                            <input type="text" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-2xl text-white focus:border-purple-500 focus:outline-none transition-all" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block font-semibold">Descrizione</label>
                        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white h-24 focus:border-purple-500 focus:outline-none transition-all resize-none" />
                    </div>

                    {/* Course Selection or Global */}
                    <div className="p-4 bg-purple-900/10 border border-purple-500/20 rounded-xl">
                        <label className="flex items-center space-x-3 text-white mb-4 cursor-pointer">
                            <input type="checkbox" checked={form.is_global_bonus} onChange={e => setForm(f => ({ ...f, is_global_bonus: e.target.checked, required_course_id: e.target.checked ? null : f.required_course_id }))} className="w-5 h-5 accent-purple-500" />
                            <span className="font-bold">Bonus Globale (Per tutti)</span>
                        </label>

                        {!form.is_global_bonus && (
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block font-semibold">Corso Richiesto (ID)</label>
                                <select value={form.required_course_id || ''} onChange={e => setForm(f => ({ ...f, required_course_id: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-all">
                                    <option value="">Seleziona Corso...</option>
                                    <option value="matrice-1" className="bg-gray-900">Storytelling (matrice-1)</option>
                                    <option value="matrice-2" className="bg-gray-900">Podcast (matrice-2)</option>
                                    <option value="ascension-box" className="bg-gray-900">Ascension Box</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block font-semibold">Tipo Consegna</label>
                            <select value={form.delivery_type} onChange={e => setForm(f => ({ ...f, delivery_type: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-all">
                                <option value="link" className="bg-gray-900">🔗 Link</option>
                                <option value="download" className="bg-gray-900">💾 Download</option>
                                <option value="video" className="bg-gray-900">📺 Video</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block font-semibold">Label Bottone</label>
                            <input type="text" value={form.action_label} onChange={e => setForm(f => ({ ...f, action_label: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-all" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 mb-2 block font-semibold">URL Contenuto</label>
                        <input type="text" value={form.content_url} onChange={e => setForm(f => ({ ...f, content_url: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-all font-mono text-sm" placeholder="https://..." />
                    </div>

                    <div className="flex items-end">
                        <label className="flex items-center space-x-3 text-gray-300 cursor-pointer p-3 bg-white/5 rounded-xl border border-white/10 w-full hover:bg-white/10 transition-all">
                            <input type="checkbox" checked={form.is_visible} onChange={e => setForm(f => ({ ...f, is_visible: e.target.checked }))} className="w-5 h-5 accent-purple-500" />
                            <span className="font-semibold">Visibile</span>
                        </label>
                    </div>

                    <button disabled={saving} className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl disabled:opacity-50 transition-all shadow-lg text-lg">
                        {saving ? 'Salvataggio...' : 'Salva Bonus'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

const UpsellFormModal = ({ upsell, onClose, onSave }: { upsell: BonusContent | null; onClose: () => void; onSave: () => void }) => {
    const [form, setForm] = useState({
        title: upsell?.title || '',
        description: upsell?.description || '',
        price_cents: upsell?.price_cents || 0,
        stripe_price_id: upsell?.stripe_price_id || '',
        order_index: upsell?.order_index || 0,
        badge: upsell?.badge || '',
        is_visible: upsell?.is_visible ?? true,
        icon: upsell?.icon || '💎',
        is_purchasable: true, // Always true for Upsells tab
        delivery_type: upsell?.delivery_type || 'link',
        content_url: upsell?.content_url || '',
        action_label: upsell?.action_label || 'ACQUISTA',
        is_global_bonus: false
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (upsell) {
                await supabase.from('bonus_content').update(form).eq('id', upsell.id);
            } else {
                await supabase.from('bonus_content').insert(form);
            }
            onSave();
        } catch (error) {
            console.error('Error saving upsell:', error);
            alert('Errore nel salvataggio');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[100dvh] md:max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {upsell ? <Pencil size={20} className="text-green-500" /> : <Plus size={20} className="text-green-500" />}
                        {upsell ? 'Modifica Upsell' : 'Nuovo Upsell'}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block font-semibold">Titolo</label>
                            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block font-semibold">Prezzo (Cents)</label>
                            <input type="number" value={form.price_cents} onChange={e => setForm(f => ({ ...f, price_cents: parseInt(e.target.value) || 0 }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block font-semibold">Icona</label>
                            <input type="text" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-xl text-white focus:border-green-500 focus:outline-none transition-all" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block font-semibold">Badge</label>
                            <input type="text" value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all uppercase" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block font-semibold">Descrizione</label>
                        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white h-24 focus:border-green-500 focus:outline-none transition-all resize-none" />
                    </div>

                    <h4 className="text-sm font-bold text-gray-500 uppercase mt-4">Configurazione Accesso</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block font-semibold">URL Contenuto</label>
                            <input type="text" value={form.content_url} onChange={e => setForm(f => ({ ...f, content_url: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all font-mono text-sm" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block font-semibold">Action Label</label>
                            <input type="text" value={form.action_label} onChange={e => setForm(f => ({ ...f, action_label: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all" />
                        </div>
                    </div>

                    <div className="flex items-end">
                        <label className="flex items-center space-x-3 text-gray-300 cursor-pointer p-3 bg-white/5 rounded-xl border border-white/10 w-full hover:bg-white/10 transition-all">
                            <input type="checkbox" checked={form.is_visible} onChange={e => setForm(f => ({ ...f, is_visible: e.target.checked }))} className="w-5 h-5 accent-green-500" />
                            <span className="font-semibold">Attivo (Visibile)</span>
                        </label>
                    </div>
                    <button disabled={saving} className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl disabled:opacity-50 transition-all shadow-lg text-lg">
                        {saving ? 'Salvataggio...' : 'Salva Upsell'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export const AdminContent: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'bonuses' | 'upsells'>('upsells');
    const [allContent, setAllContent] = useState<BonusContent[]>([]);
    const [loading, setLoading] = useState(true);

    // Derived state
    const bonuses = allContent.filter(c => !c.is_purchasable);
    const upsells = allContent.filter(c => c.is_purchasable);

    const [editingBonus, setEditingBonus] = useState<BonusContent | null>(null);
    const [editingUpsell, setEditingUpsell] = useState<BonusContent | null>(null);
    const [showBonusForm, setShowBonusForm] = useState(false);
    const [showUpsellForm, setShowUpsellForm] = useState(false);
    const [previewContent, setPreviewContent] = useState<BonusContent | null>(null);
    const [isRestoring, setIsRestoring] = useState(false);

    useEffect(() => {
        fetchData();
        setupRealTimeSubscriptions();
    }, []);

    const handleRestoreData = async () => {
        if (!confirm('ATTENZIONE: Stai per ripristinare i dati dei corsi (Matrice 1 e 2). Questo cancellerà e ricreeà moduli e lezioni. Continuare?')) return;

        setIsRestoring(true);
        try {
            await restoreCourses(supabase);
            alert('Ripristino completato con successo!');
        } catch (e) {
            console.error(e);
            alert('Errore nel ripristino. Vedi console.');
        } finally {
            setIsRestoring(false);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            // Updated to fetch from 'bonus_content'
            const { data, error } = await supabase.from('bonus_content').select('*').order('created_at', { ascending: false });
            if (error) console.error(error);
            setAllContent(data || []);
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    };

    const setupRealTimeSubscriptions = () => {
        const channel = supabase
            .channel('admin-content-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bonus_content' }, () => fetchData())
            .subscribe();

        return () => { channel.unsubscribe(); };
    };

    const handleDelete = async (id: string, type: string) => {
        if (!confirm(`Eliminare questo ${type}?`)) return;
        await supabase.from('bonus_content').delete().eq('id', id);
        fetchData();
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        await supabase.from('bonus_content').update({ is_visible: !currentStatus }).eq('id', id);
        fetchData();
    };

    const getDeliveryIcon = (type: string) => {
        switch (type) {
            case 'youtube':
            case 'vimeo':
            case 'video': return <Video size={20} className="text-red-400" />;
            case 'supabase_storage':
            case 'download': return <FileText size={20} className="text-blue-400" />;
            case 'link':
            case 'external_url': return <ExternalLink size={20} className="text-green-400" />;
            default: return <Gift size={20} className="text-amber-400" />;
        }
    };

    const getCourseBadge = (courseId: string | null) => {
        if (!courseId) return <span className="px-2 py-1 text-xs font-bold rounded-md border bg-gray-500/20 text-gray-400 border-gray-500/30">GLOBAL</span>;

        const colors: Record<string, string> = {
            'matrice-1': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            'matrice-2': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            'ascension-box': 'bg-amber-500/20 text-amber-400 border-amber-500/30'
        };
        const names: Record<string, string> = {
            'matrice-1': 'Story',
            'matrice-2': 'Podcast',
            'ascension-box': 'Box'
        };
        return (
            <span className={`px-2 py-1 text-xs font-bold rounded-md border ${colors[courseId] || 'bg-white/5 text-gray-400 border-white/10'}`}>
                {names[courseId] || courseId}
            </span>
        );
    };

    const formatPrice = (cents: number) => `€${(cents / 100).toFixed(0)}`;

    const totalRevenue = upsells.reduce((sum, u) => sum + (u.price_cents || 0), 0) / 100;
    const activeCount = allContent.filter(item => item.is_visible).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Caricamento...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 md:p-8 pb-20">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                        LA FABBRICA <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">CONTENUTI</span>
                    </h1>
                    <div className="flex gap-2">
                        <button
                            onClick={handleRestoreData}
                            disabled={isRestoring}
                            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${isRestoring ? 'bg-yellow-600/50 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-lg animate-pulse'}`}
                        >
                            {isRestoring ? 'RIPRISTINO...' : '⚠️ RIPRISTINA DATI CORSI'}
                        </button>
                        <button onClick={fetchData} className="p-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-all"><RefreshCw size={20} /></button>
                    </div>
                </div>
                <p className="text-gray-400 text-lg">Centro comando per Bonus gratuiti e Upsell Premium</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="backdrop-blur-sm bg-gradient-to-br from-green-900/20 to-emerald-900/10 border border-green-500/30 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign className="text-green-400" size={32} />
                        <span className="text-xs text-green-400 font-semibold">POTENZIALE</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">€{totalRevenue.toFixed(0)}</div>
                    <p className="text-sm text-gray-400">Valore Catalog Upsells</p>
                </div>
                <div className="backdrop-blur-sm bg-gradient-to-br from-purple-900/20 to-pink-900/10 border border-purple-500/30 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <Gift className="text-purple-400" size={32} />
                        <span className="text-xs text-purple-400 font-semibold">GRATIS</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">{bonuses.length}</div>
                    <p className="text-sm text-gray-400">Bonus Disponibili</p>
                </div>
                <div className="backdrop-blur-sm bg-gradient-to-br from-amber-900/20 to-orange-900/10 border border-amber-500/30 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <Zap className="text-amber-400" size={32} />
                        <span className="text-xs text-amber-400 font-semibold">ATTIVI</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">{activeCount}</div>
                    <p className="text-sm text-gray-400">Contenuti Pubblicati</p>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex gap-4 mb-8">
                <button onClick={() => setActiveTab('bonuses')} className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'bonuses' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                    <Gift size={20} /> Bonus Gratuiti ({bonuses.length})
                </button>
                <button onClick={() => setActiveTab('upsells')} className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'upsells' ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                    <ShoppingBag size={20} /> Upsells Premium ({upsells.length})
                </button>
            </motion.div>

            <AnimatePresence mode="wait">
                {activeTab === 'bonuses' && (
                    <motion.div key="bonuses" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                        <button onClick={() => { setEditingBonus(null); setShowBonusForm(true); }} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                            <Plus size={20} /> Nuovo Bonus
                        </button>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {bonuses.map((bonus, index) => (
                                <motion.div key={bonus.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} className={`backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/[0.02] border rounded-2xl p-6 hover:border-purple-500/50 hover:shadow-xl transition-all ${bonus.is_visible ? 'border-white/10' : 'border-red-500/30 opacity-60'}`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-purple-500/20 rounded-xl">{getDeliveryIcon(bonus.delivery_type)}</div>
                                            <div>
                                                <h3 className="font-bold text-white text-lg leading-tight flex items-center gap-2">
                                                    {bonus.icon} {bonus.title}
                                                </h3>
                                                {!bonus.is_visible && <span className="text-xs bg-red-900/30 text-red-400 px-2 rounded">INATTIVO</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-4">{bonus.description}</p>
                                    <div className="flex flex-wrap items-center gap-2 mb-6">
                                        {getCourseBadge(bonus.required_course_id)}
                                        {bonus.is_global_bonus && <span className="px-2 py-1 text-xs font-bold rounded-md bg-pink-500/20 text-pink-400">GLOBAL</span>}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleToggleActive(bonus.id, bonus.is_visible)} className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${bonus.is_visible ? 'bg-green-600/20 text-green-400' : 'bg-white/5 text-gray-500'}`}>
                                            <Check size={16} className="inline mr-1" /> {bonus.is_visible ? 'Attivo' : 'Attiva'}
                                        </button>
                                        <button onClick={() => setPreviewContent(bonus)} className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg"><Eye size={16} /></button>
                                        <button onClick={() => { setEditingBonus(bonus); setShowBonusForm(true); }} className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg"><Pencil size={16} /></button>
                                        <button onClick={() => handleDelete(bonus.id, 'bonus')} className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg"><Trash2 size={16} /></button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'upsells' && (
                    <motion.div key="upsells" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                        <button onClick={() => { setEditingUpsell(null); setShowUpsellForm(true); }} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                            <Plus size={20} /> Nuovo Upsell
                        </button>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {upsells.map((upsell, index) => (
                                <motion.div key={upsell.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} className={`backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/[0.02] border rounded-2xl p-6 hover:border-green-500/50 hover:shadow-xl transition-all ${upsell.is_visible ? 'border-white/10' : 'border-red-500/30 opacity-60'}`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-bold text-white text-lg">{upsell.icon} {upsell.title}</h3>
                                                {upsell.badge && <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-md border border-amber-500/30 font-bold">{upsell.badge}</span>}
                                            </div>
                                            {!upsell.is_visible && <span className="text-xs bg-red-900/30 text-red-400 px-2 rounded">INATTIVO</span>}
                                        </div>
                                        <div className="text-3xl font-black text-green-400">{formatPrice(upsell.price_cents)}</div>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-4">{upsell.description}</p>
                                    <div className="p-3 bg-black/30 rounded-xl border border-white/5 mb-4">
                                        <p className="text-xs text-gray-500 font-mono truncate">{upsell.stripe_price_id || 'No Stripe ID'}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleToggleActive(upsell.id, upsell.is_visible)} className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${upsell.is_visible ? 'bg-green-600/20 text-green-400' : 'bg-white/5 text-gray-500'}`}>
                                            <Check size={16} className="inline mr-1" /> {upsell.is_visible ? 'Attivo' : 'Attiva'}
                                        </button>
                                        <button onClick={() => { setEditingUpsell(upsell); setShowUpsellForm(true); }} className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg"><Pencil size={16} /></button>
                                        <button onClick={() => handleDelete(upsell.id, 'upsell')} className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg"><Trash2 size={16} /></button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ContentPreviewModal
                content={previewContent ? {
                    id: previewContent.id,
                    title: previewContent.title,
                    description: previewContent.description,
                    content_type: previewContent.delivery_type as any,
                    content_url: previewContent.content_url
                } : null}
                onClose={() => setPreviewContent(null)}
            />
        </div>
    );
};

export default AdminContent;
