import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Copy, Tag, Clock, Users, RefreshCw, X, Check, Percent, DollarSign, TrendingUp } from 'lucide-react';
import { supabase } from '../../services/supabase';

interface PromoCode {
    id: string;
    code: string;
    description: string;
    discount_type: 'percentage' | 'fixed_amount';
    discount_value: number;
    applicable_tiers: string[] | null;
    min_purchase_amount: number | null;
    max_uses: number | null;
    uses_count: number;
    valid_from: string;
    valid_until: string | null;
    active: boolean;
    created_at: string;
}

export const AdminDiscounts: React.FC = () => {
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    useEffect(() => {
        fetchPromoCodes();
        setupRealtime();
    }, []);

    const setupRealtime = () => {
        const channel = supabase
            .channel('promo-codes-updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'promo_codes' }, () => {
                fetchPromoCodes();
            })
            .subscribe();

        return () => { channel.unsubscribe(); };
    };

    const fetchPromoCodes = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('promo_codes')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPromoCodes(data || []);
        } catch (error) {
            console.error('Error fetching promo codes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Eliminare questo codice sconto?')) return;
        await supabase.from('promo_codes').delete().eq('id', id);
    };

    const handleToggleActive = async (id: string, active: boolean) => {
        await supabase.from('promo_codes').update({ active: !active }).eq('id', id);
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const generateRandomCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = 'VOX';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const formatDiscount = (code: PromoCode) => {
        if (code.discount_type === 'percentage') {
            return `${code.discount_value}%`;
        }
        return `€${(code.discount_value / 100).toFixed(0)}`;
    };

    const isExpired = (validUntil: string | null) => {
        if (!validUntil) return false;
        return new Date(validUntil) < new Date();
    };

    const isMaxedOut = (code: PromoCode) => {
        if (!code.max_uses) return false;
        return code.uses_count >= code.max_uses;
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
            'ascension-box': 'Ascension'
        };
        return (
            <span className={`px-2 py-0.5 text-xs font-bold rounded border ${colors[tier] || 'bg-zinc-800'}`}>
                {names[tier] || tier}
            </span>
        );
    };

    const activeCodes = promoCodes.filter(c => c.active && !isExpired(c.valid_until) && !isMaxedOut(c));
    const totalUses = promoCodes.reduce((sum, c) => sum + c.uses_count, 0);
    const expiredCodes = promoCodes.filter(c => isExpired(c.valid_until) || isMaxedOut(c));

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 md:p-8 pb-20 space-y-8">
            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500">
                        PROMO CODES
                    </span>
                </h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchPromoCodes}
                        className="p-2 bg-white/5 border border-white/10 text-gray-400 rounded-xl hover:bg-white/10 transition-all duration-300"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <button
                        onClick={() => { setEditingCode(null); setShowForm(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-green-500/50"
                    >
                        <Plus size={20} />
                        Nuovo Codice
                    </button>
                </div>
            </motion.div>

            {/* STATS SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="backdrop-blur-sm bg-gradient-to-br from-green-500/10 to-green-700/5 border border-green-500/30 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 hover:scale-105"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-3 bg-green-500/20 rounded-xl backdrop-blur-sm">
                            <Tag className="text-green-400" size={24} />
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-600/20 border border-green-500/30 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-400 font-bold">LIVE</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">Codici Attivi</p>
                    <h3 className="text-4xl font-black text-green-400">{activeCodes.length}</h3>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="backdrop-blur-sm bg-gradient-to-br from-blue-500/10 to-blue-700/5 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
                >
                    <div className="p-3 bg-blue-500/20 rounded-xl backdrop-blur-sm mb-3">
                        <Users className="text-blue-400" size={24} />
                    </div>
                    <p className="text-sm text-gray-400 mb-1">Utilizzi Totali</p>
                    <h3 className="text-4xl font-black text-blue-400">{totalUses}</h3>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="backdrop-blur-sm bg-gradient-to-br from-red-500/10 to-red-700/5 border border-red-500/30 rounded-2xl p-6 hover:border-red-500/50 transition-all duration-300 hover:scale-105"
                >
                    <div className="p-3 bg-red-500/20 rounded-xl backdrop-blur-sm mb-3">
                        <Clock className="text-red-400" size={24} />
                    </div>
                    <p className="text-sm text-gray-400 mb-1">Codici Scaduti</p>
                    <h3 className="text-4xl font-black text-red-400">{expiredCodes.length}</h3>
                </motion.div>
            </div>

            {/* PROMO CODES LIST */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
            >
                {promoCodes.length === 0 ? (
                    <div className="text-center py-20 backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl">
                        <Tag size={64} className="mx-auto mb-4 text-gray-600" />
                        <p className="text-gray-400 text-lg mb-2">Nessun codice sconto.</p>
                        <p className="text-sm text-gray-500">Crea il tuo primo codice promozionale!</p>
                    </div>
                ) : (
                    promoCodes.map((code, index) => {
                        const expired = isExpired(code.valid_until);
                        const maxed = isMaxedOut(code);
                        const disabled = !code.active || expired || maxed;

                        return (
                            <motion.div
                                key={code.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/[0.02] border rounded-2xl p-6 hover:border-white/20 transition-all duration-300 ${disabled ? 'border-white/5 opacity-60' : 'border-white/10'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <button
                                                onClick={() => copyToClipboard(code.code)}
                                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-300 group"
                                            >
                                                <code className="text-xl font-mono font-black text-green-400">{code.code}</code>
                                                {copiedCode === code.code ? (
                                                    <Check size={16} className="text-green-400" />
                                                ) : (
                                                    <Copy size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                                                )}
                                            </button>

                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold ${code.discount_type === 'percentage'
                                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                                : 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                }`}>
                                                {code.discount_type === 'percentage' ? <Percent size={16} /> : <DollarSign size={16} />}
                                                <span className="text-lg">{formatDiscount(code)}</span>
                                            </div>

                                            {expired && <span className="text-xs bg-red-900/30 text-red-400 px-3 py-1 rounded-lg font-bold">SCADUTO</span>}
                                            {maxed && <span className="text-xs bg-orange-900/30 text-orange-400 px-3 py-1 rounded-lg font-bold">ESAURITO</span>}
                                            {!code.active && <span className="text-xs bg-gray-800 text-gray-500 px-3 py-1 rounded-lg font-bold">DISATTIVO</span>}
                                        </div>

                                        {code.description && <p className="text-sm text-gray-400 mb-3">{code.description}</p>}

                                        <div className="flex items-center flex-wrap gap-3 text-xs text-gray-500">
                                            {code.applicable_tiers && code.applicable_tiers.length > 0 ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-400">Tier:</span>
                                                    {code.applicable_tiers.map(t => <span key={t}>{getTierBadge(t)}</span>)}
                                                </div>
                                            ) : (
                                                <span className="text-green-400 font-bold">✓ Tutti i tier</span>
                                            )}
                                            {code.max_uses && (
                                                <span className="px-2 py-1 bg-white/5 rounded">
                                                    📊 Utilizzi: {code.uses_count}/{code.max_uses}
                                                </span>
                                            )}
                                            {code.valid_until && (
                                                <span className="px-2 py-1 bg-white/5 rounded">
                                                    🗓️ Scade: {new Date(code.valid_until).toLocaleDateString('it-IT')}
                                                </span>
                                            )}
                                            {code.min_purchase_amount && (
                                                <span className="px-2 py-1 bg-white/5 rounded">
                                                    💰 Min: €{code.min_purchase_amount / 100}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleActive(code.id, code.active)}
                                            className={`p-3 rounded-xl transition-all duration-300 ${code.active
                                                ? 'text-green-400 bg-green-500/20 hover:bg-green-500/30'
                                                : 'text-gray-500 bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <Check size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(code.id)}
                                            className="p-3 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-900/20 rounded-xl transition-all duration-300"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </motion.div>

            {/* FORM MODAL */}
            <AnimatePresence>
                {showForm && (
                    <PromoCodeFormModal
                        code={editingCode}
                        generateCode={generateRandomCode}
                        onClose={() => setShowForm(false)}
                        onSave={() => { setShowForm(false); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// PROMO CODE FORM MODAL
const PromoCodeFormModal = ({ code, generateCode, onClose, onSave }: {
    code: PromoCode | null;
    generateCode: () => string;
    onClose: () => void;
    onSave: () => void;
}) => {
    const [form, setForm] = useState({
        code: code?.code || generateCode(),
        description: code?.description || '',
        discount_type: code?.discount_type || 'percentage' as 'percentage' | 'fixed_amount',
        discount_value: code?.discount_value || 10,
        applicable_tiers: code?.applicable_tiers || null,
        min_purchase_amount: code?.min_purchase_amount || null,
        max_uses: code?.max_uses || null,
        valid_until: code?.valid_until ? code.valid_until.split('T')[0] : '',
        active: code?.active ?? true
    });
    const [saving, setSaving] = useState(false);
    const [selectedTiers, setSelectedTiers] = useState<string[]>(code?.applicable_tiers || []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...form,
                applicable_tiers: selectedTiers.length > 0 ? selectedTiers : null,
                valid_until: form.valid_until ? new Date(form.valid_until).toISOString() : null
            };

            if (code) {
                await supabase.from('promo_codes').update(payload).eq('id', code.id);
            } else {
                await supabase.from('promo_codes').insert(payload);
            }
            onSave();
        } catch (error) {
            console.error('Error saving promo code:', error);
            alert('Errore nel salvataggio');
        } finally {
            setSaving(false);
        }
    };

    const toggleTier = (tier: string) => {
        setSelectedTiers(prev =>
            prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.form
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
                className="bg-gradient-to-br from-gray-900 to-black border border-green-500/30 rounded-2xl p-6 md:p-8 w-full max-w-lg space-y-6 max-h-[100dvh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-black text-white">{code ? 'Modifica Codice' : 'Nuovo Codice Sconto'}</h2>
                    <button type="button" onClick={onClose} className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="CODICE"
                        value={form.code}
                        onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                        required
                        className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white font-mono text-lg uppercase focus:border-green-500 focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => setForm(f => ({ ...f, code: generateCode() }))}
                        className="px-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-colors"
                    >
                        🎲
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Descrizione (opzionale)"
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                />

                <div className="grid grid-cols-2 gap-4">
                    <select
                        value={form.discount_type}
                        onChange={e => setForm(f => ({ ...f, discount_type: e.target.value as 'percentage' | 'fixed_amount' }))}
                        className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                    >
                        <option value="percentage">Percentuale (%)</option>
                        <option value="fixed_amount">Importo Fisso (€)</option>
                    </select>
                    <input
                        type="number"
                        placeholder={form.discount_type === 'percentage' ? 'Es: 20' : 'Es: 5000 (€50)'}
                        value={form.discount_value}
                        onChange={e => setForm(f => ({ ...f, discount_value: parseInt(e.target.value) || 0 }))}
                        className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-400 mb-2 block">Tier Applicabili (vuoto = tutti)</label>
                    <div className="flex gap-2">
                        {['matrice-1', 'matrice-2', 'ascension-box'].map(tier => (
                            <button
                                key={tier}
                                type="button"
                                onClick={() => toggleTier(tier)}
                                className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all ${selectedTiers.includes(tier)
                                    ? 'bg-green-600 border-green-500 text-white'
                                    : 'bg-white/10 border-white/20 text-gray-400 hover:border-white/40'
                                    }`}
                            >
                                {tier.replace('matrice-', 'M').replace('ascension-box', 'Ascension')}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="number"
                        placeholder="Max Utilizzi"
                        value={form.max_uses || ''}
                        onChange={e => setForm(f => ({ ...f, max_uses: e.target.value ? parseInt(e.target.value) : null }))}
                        className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                    />
                    <input
                        type="date"
                        value={form.valid_until}
                        onChange={e => setForm(f => ({ ...f, valid_until: e.target.value }))}
                        className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                    />
                </div>

                <input
                    type="number"
                    placeholder="Acquisto Minimo (cents, es: 50000 = €500)"
                    value={form.min_purchase_amount || ''}
                    onChange={e => setForm(f => ({ ...f, min_purchase_amount: e.target.value ? parseInt(e.target.value) : null }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                />

                <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={form.active}
                        onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                        className="rounded"
                    />
                    <span>Attivo Immediatamente</span>
                </label>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-green-500/50"
                >
                    {saving ? 'Salvataggio...' : (code ? 'Aggiorna Codice' : 'Crea Codice')}
                </button>
            </motion.form>
        </motion.div>
    );
};
