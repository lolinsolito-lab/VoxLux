import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Gift, ShoppingBag, ExternalLink, FileText, Video, Music, RefreshCw, X, Check, TrendingUp, DollarSign, Zap, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../services/supabase';

interface BonusProduct {
    id: string;
    name: string;
    description: string;
    tier_applicable: string[];
    eligibility_hours: number;
    delivery_type: string;
    content_url: string;
    active: boolean;
}

interface UpsellProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    stripe_price_id: string;
    display_order: number;
    badge: string;
    active: boolean;
    available_for_tiers: string[];
}

export const AdminContent: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'bonuses' | 'upsells'>('upsells');
    const [bonuses, setBonuses] = useState<BonusProduct[]>([]);
    const [upsells, setUpsells] = useState<UpsellProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingBonus, setEditingBonus] = useState<BonusProduct | null>(null);
    const [editingUpsell, setEditingUpsell] = useState<UpsellProduct | null>(null);
    const [showBonusForm, setShowBonusForm] = useState(false);
    const [showUpsellForm, setShowUpsellForm] = useState(false);

    useEffect(() => {
        fetchData();
        setupRealTimeSubscriptions();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [bonusRes, upsellRes] = await Promise.all([
                supabase.from('bonus_products').select('*').order('created_at', { ascending: false }),
                supabase.from('upsell_products').select('*').order('display_order', { ascending: true })
            ]);
            setBonuses(bonusRes.data || []);
            setUpsells(upsellRes.data || []);
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    };

    const setupRealTimeSubscriptions = () => {
        const channel = supabase
            .channel('admin-content-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bonus_products' }, () => fetchData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'upsell_products' }, () => fetchData())
            .subscribe();

        return () => { channel.unsubscribe(); };
    };

    const handleDeleteBonus = async (id: string) => {
        if (!confirm('Eliminare questo bonus?')) return;
        await supabase.from('bonus_products').delete().eq('id', id);
        fetchData();
    };

    const handleDeleteUpsell = async (id: string) => {
        if (!confirm('Eliminare questo upsell?')) return;
        await supabase.from('upsell_products').delete().eq('id', id);
        fetchData();
    };

    const handleToggleBonusActive = async (id: string, active: boolean) => {
        await supabase.from('bonus_products').update({ active: !active }).eq('id', id);
        fetchData();
    };

    const handleToggleUpsellActive = async (id: string, active: boolean) => {
        await supabase.from('upsell_products').update({ active: !active }).eq('id', id);
        fetchData();
    };

    const getDeliveryIcon = (type: string) => {
        switch (type) {
            case 'youtube':
            case 'vimeo': return <Video size={20} className="text-red-400" />;
            case 'supabase_storage':
            case 'download_link': return <FileText size={20} className="text-blue-400" />;
            case 'external_url': return <ExternalLink size={20} className="text-green-400" />;
            default: return <Gift size={20} className="text-amber-400" />;
        }
    };

    const getTierBadge = (tier: string) => {
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
            <span className={`px-2 py-1 text-xs font-bold rounded-md border ${colors[tier] || 'bg-white/5 text-gray-400 border-white/10'}`}>
                {names[tier] || tier}
            </span>
        );
    };

    const formatPrice = (cents: number) => `€${(cents / 100).toFixed(0)}`;

    // Calculate stats
    const totalRevenue = upsells.reduce((sum, u) => sum + u.price, 0) / 100;
    const activeCount = [...bonuses, ...upsells].filter(item => item.active).length;

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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-5xl font-black tracking-tight">
                        LA FABBRICA <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">CONTENUTI</span>
                    </h1>
                    <button
                        onClick={fetchData}
                        className="p-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
                <p className="text-gray-400 text-lg">Centro comando per Bonus gratuiti e Upsell Premium</p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
            >
                <div className="backdrop-blur-sm bg-gradient-to-br from-green-900/20 to-emerald-900/10 border border-green-500/30 rounded-2xl p-6 hover:border-green-500/60 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign className="text-green-400" size={32} />
                        <span className="text-xs text-green-400 font-semibold">POTENZIALE</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">€{totalRevenue.toFixed(0)}</div>
                    <p className="text-sm text-gray-400">Valore Catalog Upsells</p>
                </div>

                <div className="backdrop-blur-sm bg-gradient-to-br from-purple-900/20 to-pink-900/10 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/60 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <Gift className="text-purple-400" size={32} />
                        <span className="text-xs text-purple-400 font-semibold">GRATIS</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">{bonuses.length}</div>
                    <p className="text-sm text-gray-400">Bonus Disponibili</p>
                </div>

                <div className="backdrop-blur-sm bg-gradient-to-br from-amber-900/20 to-orange-900/10 border border-amber-500/30 rounded-2xl p-6 hover:border-amber-500/60 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <Zap className="text-amber-400" size={32} />
                        <span className="text-xs text-amber-400 font-semibold">ATTIVI</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">{activeCount}</div>
                    <p className="text-sm text-gray-400">Contenuti Pubblicati</p>
                </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex gap-4 mb-8"
            >
                <button
                    onClick={() => setActiveTab('bonuses')}
                    className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'bonuses'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                >
                    <Gift size={20} />
                    Bonus Gratuiti ({bonuses.length})
                </button>
                <button
                    onClick={() => setActiveTab('upsells')}
                    className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'upsells'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                >
                    <ShoppingBag size={20} />
                    Upsells Premium ({upsells.length})
                </button>
            </motion.div>

            {/* BONUSES TAB */}
            <AnimatePresence mode="wait">
                {activeTab === 'bonuses' && (
                    <motion.div
                        key="bonuses"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                    >
                        <button
                            onClick={() => { setEditingBonus(null); setShowBonusForm(true); }}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
                        >
                            <Plus size={20} />
                            Nuovo Bonus
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {bonuses.map((bonus, index) => (
                                <motion.div
                                    key={bonus.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/[0.02] border rounded-2xl p-6 transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 group ${bonus.active ? 'border-white/10' : 'border-red-500/30 opacity-60'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-purple-500/20 rounded-xl">
                                                {getDeliveryIcon(bonus.delivery_type)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-lg leading-tight">{bonus.name}</h3>
                                                {!bonus.active && (
                                                    <span className="inline-block mt-1 text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded">
                                                        INATTIVO
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-400 mb-4 leading-relaxed">{bonus.description}</p>

                                    <div className="flex flex-wrap items-center gap-2 mb-6">
                                        {bonus.tier_applicable?.map(tier => (
                                            <span key={tier}>{getTierBadge(tier)}</span>
                                        ))}
                                        <span className="text-xs text-gray-500 ml-2">• Finestra: {bonus.eligibility_hours}h</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggleBonusActive(bonus.id, bonus.active)}
                                            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${bonus.active
                                                ? 'bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-600/30'
                                                : 'bg-white/5 border border-white/10 text-gray-500 hover:bg-white/10'
                                                }`}
                                        >
                                            <Check size={16} className="inline mr-1" />
                                            {bonus.active ? 'Attivo' : 'Disattivo'}
                                        </button>
                                        <button
                                            onClick={() => { setEditingBonus(bonus); setShowBonusForm(true); }}
                                            className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-all duration-300"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBonus(bonus.id)}
                                            className="px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-600/30 transition-all duration-300"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {bonuses.length === 0 && (
                            <div className="text-center py-20">
                                <Gift className="mx-auto mb-4 text-gray-600" size={64} />
                                <p className="text-xl text-gray-400">Nessun bonus disponibile</p>
                                <p className="text-sm text-gray-500 mt-2">Crea il primo bonus gratuito!</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* UPSELLS TAB */}
                {activeTab === 'upsells' && (
                    <motion.div
                        key="upsells"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                    >
                        <button
                            onClick={() => { setEditingUpsell(null); setShowUpsellForm(true); }}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg hover:shadow-green-500/50"
                        >
                            <Plus size={20} />
                            Nuovo Upsell
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {upsells.map((upsell, index) => (
                                <motion.div
                                    key={upsell.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/[0.02] border rounded-2xl p-6 transition-all duration-300 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/10 group ${upsell.active ? 'border-white/10' : 'border-red-500/30 opacity-60'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-bold text-white text-lg">{upsell.name}</h3>
                                                {upsell.badge && (
                                                    <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-md border border-amber-500/30 font-bold">
                                                        {upsell.badge}
                                                    </span>
                                                )}
                                            </div>
                                            {!upsell.active && (
                                                <span className="inline-block text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded">
                                                    INATTIVO
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-3xl font-black text-green-400">
                                            {formatPrice(upsell.price)}
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-400 mb-4 leading-relaxed">{upsell.description}</p>

                                    <div className="p-3 bg-black/30 rounded-xl border border-white/5 mb-4">
                                        <p className="text-xs text-gray-500 font-mono truncate">
                                            {upsell.stripe_price_id || 'No Stripe ID'}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggleUpsellActive(upsell.id, upsell.active)}
                                            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${upsell.active
                                                    ? 'bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-600/30'
                                                    : 'bg-white/5 border border-white/10 text-gray-500 hover:bg-white/10'
                                                }`}
                                        >
                                            <Check size={16} className="inline mr-1" />
                                            {upsell.active ? 'Attivo' : 'Disattivo'}
                                        </button>
                                        <button
                                            onClick={() => { setEditingUpsell(upsell); setShowUpsellForm(true); }}
                                            className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-all duration-300"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUpsell(upsell.id)}
                                            className="px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-600/30 transition-all duration-300"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {
                            upsells.length === 0 && (
                                <div className="text-center py-20">
                                    <ShoppingBag className="mx-auto mb-4 text-gray-600" size={64} />
                                    <p className="text-xl text-gray-400">Nessun upsell disponibile</p>
                                    <p className="text-sm text-gray-500 mt-2">Crea il primo upsell premium!</p>
                                </div>
                            )
                        }
                    </motion.div >
                )}
            </AnimatePresence >

            {/* MODALS */}
            <AnimatePresence>
                {
                    showBonusForm && (
                        <BonusFormModal
                            bonus={editingBonus}
                            onClose={() => setShowBonusForm(false)}
                            onSave={() => { setShowBonusForm(false); fetchData(); }}
                        />
                    )
                }

                {
                    showUpsellForm && (
                        <UpsellFormModal
                            upsell={editingUpsell}
                            onClose={() => setShowUpsellForm(false)}
                            onSave={() => { setShowUpsellForm(false); fetchData(); }}
                        />
                    )
                }
            </AnimatePresence >
        </div >
    );
};

// BONUS FORM MODAL
const BonusFormModal = ({ bonus, onClose, onSave }: { bonus: BonusProduct | null; onClose: () => void; onSave: () => void }) => {
    const [form, setForm] = useState({
        name: bonus?.name || '',
        description: bonus?.description || '',
        tier_applicable: bonus?.tier_applicable || [],
        eligibility_hours: bonus?.eligibility_hours || 24,
        delivery_type: bonus?.delivery_type || 'supabase_storage',
        content_url: bonus?.content_url || '',
        active: bonus?.active ?? true
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (bonus) {
                await supabase.from('bonus_products').update(form).eq('id', bonus.id);
            } else {
                await supabase.from('bonus_products').insert(form);
            }
            onSave();
        } catch (error) {
            console.error('Error saving bonus:', error);
            alert('Errore nel salvataggio');
        } finally {
            setSaving(false);
        }
    };

    const toggleTier = (tier: string) => {
        setForm(f => ({
            ...f,
            tier_applicable: f.tier_applicable.includes(tier)
                ? f.tier_applicable.filter(t => t !== tier)
                : [...f.tier_applicable, tier]
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.form
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-2xl p-8 w-full max-w-2xl space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-white">{bonus ? 'Modifica Bonus' : 'Nuovo Bonus'}</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all">
                        <X size={24} />
                    </button>
                </div>

                <div>
                    <label className="text-sm text-gray-400 mb-2 block font-semibold">Nome Bonus</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        required
                        placeholder="es. Template Storytelling Esclusivi"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-400 mb-2 block font-semibold">Descrizione</label>
                    <textarea
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Raccolta di 20 template pronti all'uso per storytelling efficace"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 h-24 focus:border-purple-500 focus:outline-none transition-all resize-none"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-400 mb-3 block font-semibold">Tier Applicabili</label>
                    <div className="flex flex-wrap gap-3">
                        {['matrice-1', 'matrice-2', 'ascension-box'].map(tier => (
                            <button
                                key={tier}
                                type="button"
                                onClick={() => toggleTier(tier)}
                                className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all duration-300 ${form.tier_applicable.includes(tier)
                                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/30'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                {tier.replace('matrice-', 'Matrice ').replace('ascension-box', 'Ascension Box')}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-sm text-gray-400 mb-2 block font-semibold">Tipo Delivery</label>
                    <select
                        value={form.delivery_type}
                        onChange={e => setForm(f => ({ ...f, delivery_type: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-all"
                    >
                        <option value="supabase_storage">Supabase Storage</option>
                        <option value="external_url">Link Esterno</option>
                        <option value="youtube">YouTube</option>
                        <option value="vimeo">Vimeo</option>
                        <option value="download_link">Download Link</option>
                    </select>
                </div>

                <div>
                    <label className="text-sm text-gray-400 mb-2 block font-semibold">URL Contenuto</label>
                    <input
                        type="text"
                        value={form.content_url}
                        onChange={e => setForm(f => ({ ...f, content_url: e.target.value }))}
                        placeholder="https://..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all font-mono text-sm"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block font-semibold">Ore Eleggibilità</label>
                        <input
                            type="number"
                            value={form.eligibility_hours}
                            onChange={e => setForm(f => ({ ...f, eligibility_hours: parseInt(e.target.value) || 24 }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-end">
                        <label className="flex items-center space-x-3 text-gray-300 cursor-pointer p-3 bg-white/5 rounded-xl border border-white/10 w-full hover:bg-white/10 transition-all">
                            <input
                                type="checkbox"
                                checked={form.active}
                                onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                                className="w-5 h-5 accent-purple-500"
                            />
                            <span className="font-semibold">Attivo</span>
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-purple-500/50 text-lg"
                >
                    {saving ? 'Salvataggio...' : (bonus ? 'Aggiorna Bonus' : 'Crea Bonus')}
                </button>
            </motion.form>
        </motion.div>
    );
};

// UPSELL FORM MODAL
const UpsellFormModal = ({ upsell, onClose, onSave }: { upsell: UpsellProduct | null; onClose: () => void; onSave: () => void }) => {
    const [form, setForm] = useState({
        name: upsell?.name || '',
        description: upsell?.description || '',
        price: upsell?.price || 0,
        stripe_price_id: upsell?.stripe_price_id || '',
        display_order: upsell?.display_order || 0,
        badge: upsell?.badge || '',
        active: upsell?.active ?? true,
        available_for_tiers: upsell?.available_for_tiers || []
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (upsell) {
                await supabase.from('upsell_products').update(form).eq('id', upsell.id);
            } else {
                await supabase.from('upsell_products').insert(form);
            }
            onSave();
        } catch (error) {
            console.error('Error saving upsell:', error);
            alert('Errore nel salvataggio');
        } finally {
            setSaving(false);
        }
    };

    const toggleTier = (tier: string) => {
        setForm(f => ({
            ...f,
            available_for_tiers: f.available_for_tiers.includes(tier)
                ? f.available_for_tiers.filter(t => t !== tier)
                : [...f.available_for_tiers, tier]
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.form
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-900 to-black border border-green-500/30 rounded-2xl p-8 w-full max-w-2xl space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-white">{upsell ? 'Modifica Upsell' : 'Nuovo Upsell'}</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all">
                        <X size={24} />
                    </button>
                </div>

                <div>
                    <label className="text-sm text-gray-400 mb-2 block font-semibold">Nome Upsell</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        required
                        placeholder="es. 1-on-1 Coaching Session"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-400 mb-2 block font-semibold">Descrizione</label>
                    <textarea
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Sessione personalizzata di coaching (60 min)"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 h-24 focus:border-green-500 focus:outline-none transition-all resize-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block font-semibold">Prezzo (cents)</label>
                        <input
                            type="number"
                            value={form.price}
                            onChange={e => setForm(f => ({ ...f, price: parseInt(e.target.value) || 0 }))}
                            placeholder="19700"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-all"
                        />
                        <p className="text-xs text-gray-500 mt-1">€{(form.price / 100).toFixed(2)}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block font-semibold">Stripe Price ID</label>
                        <input
                            type="text"
                            value={form.stripe_price_id}
                            onChange={e => setForm(f => ({ ...f, stripe_price_id: e.target.value }))}
                            placeholder="price_xxx"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-all font-mono text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block font-semibold">Ordine Display</label>
                        <input
                            type="number"
                            value={form.display_order}
                            onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block font-semibold">Badge (opzionale)</label>
                        <input
                            type="text"
                            value={form.badge}
                            onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                            placeholder="POPULAR"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-all uppercase"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm text-gray-400 mb-3 block font-semibold">Disponibile per Tier</label>
                    <div className="flex flex-wrap gap-3">
                        {['matrice-1', 'matrice-2', 'ascension-box'].map(tier => (
                            <button
                                key={tier}
                                type="button"
                                onClick={() => toggleTier(tier)}
                                className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all duration-300 ${form.available_for_tiers.includes(tier)
                                    ? 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-500/30'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                {tier.replace('matrice-', 'Matrice ').replace('ascension-box', 'Ascension Box')}
                            </button>
                        ))}
                    </div>
                </div>

                <label className="flex items-center space-x-3 text-gray-300 cursor-pointer p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                    <input
                        type="checkbox"
                        checked={form.active}
                        onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                        className="w-5 h-5 accent-green-500"
                    />
                    <span className="font-semibold">Attivo</span>
                </label>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-green-500/50 text-lg"
                >
                    {saving ? 'Salvataggio...' : (upsell ? 'Aggiorna Upsell' : 'Crea Upsell')}
                </button>
            </motion.form>
        </motion.div>
    );
};
