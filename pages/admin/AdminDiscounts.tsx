import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Copy, Tag, Clock, Users, RefreshCw, X, Check, Percent, DollarSign } from 'lucide-react';
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
    }, []);

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
        fetchPromoCodes();
    };

    const handleToggleActive = async (id: string, active: boolean) => {
        await supabase.from('promo_codes').update({ active: !active }).eq('id', id);
        fetchPromoCodes();
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
            'matrice-1': 'bg-blue-500/20 text-blue-400',
            'matrice-2': 'bg-purple-500/20 text-purple-400',
            'ascension-box': 'bg-yellow-500/20 text-yellow-400'
        };
        const names: Record<string, string> = {
            'matrice-1': 'Story',
            'matrice-2': 'Podcast',
            'ascension-box': 'Ascension'
        };
        return (
            <span className={`px-2 py-0.5 text-xs font-bold rounded ${colors[tier] || 'bg-zinc-800'}`}>
                {names[tier] || tier}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black tracking-tighter text-white">
                    GENERATORE <span className="text-green-500">SCONTI</span>
                </h1>
                <div className="flex items-center space-x-2">
                    <button onClick={fetchPromoCodes} className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg transition-colors">
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={() => { setEditingCode(null); setShowForm(true); }}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold text-sm transition-colors"
                    >
                        <Plus size={16} />
                        <span>Nuovo Codice</span>
                    </button>
                </div>
            </div>

            {/* STATS SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <Tag className="text-green-500" size={24} />
                        <div>
                            <p className="text-zinc-400 text-sm">Codici Attivi</p>
                            <p className="text-2xl font-bold text-white">{promoCodes.filter(c => c.active && !isExpired(c.valid_until)).length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <Users className="text-blue-500" size={24} />
                        <div>
                            <p className="text-zinc-400 text-sm">Utilizzi Totali</p>
                            <p className="text-2xl font-bold text-white">{promoCodes.reduce((sum, c) => sum + c.uses_count, 0)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <Clock className="text-yellow-500" size={24} />
                        <div>
                            <p className="text-zinc-400 text-sm">Codici Scaduti</p>
                            <p className="text-2xl font-bold text-white">{promoCodes.filter(c => isExpired(c.valid_until) || isMaxedOut(c)).length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* PROMO CODES LIST */}
            <div className="space-y-4">
                {promoCodes.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500">
                        <Tag size={48} className="mx-auto mb-4 opacity-30" />
                        <p>Nessun codice sconto.</p>
                        <p className="text-sm">Crea il tuo primo codice promozionale!</p>
                    </div>
                ) : (
                    promoCodes.map((code) => {
                        const expired = isExpired(code.valid_until);
                        const maxed = isMaxedOut(code);
                        const disabled = !code.active || expired || maxed;

                        return (
                            <div
                                key={code.id}
                                className={`bg-zinc-900/50 border rounded-xl p-4 ${disabled ? 'border-zinc-800/50 opacity-60' : 'border-zinc-800'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <button
                                                onClick={() => copyToClipboard(code.code)}
                                                className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors group"
                                            >
                                                <code className="text-lg font-mono font-bold text-green-400">{code.code}</code>
                                                {copiedCode === code.code ? (
                                                    <Check size={14} className="text-green-400" />
                                                ) : (
                                                    <Copy size={14} className="text-zinc-500 group-hover:text-white" />
                                                )}
                                            </button>

                                            <span className={`flex items-center space-x-1 text-lg font-bold ${code.discount_type === 'percentage' ? 'text-yellow-400' : 'text-green-400'}`}>
                                                {code.discount_type === 'percentage' ? <Percent size={16} /> : <DollarSign size={16} />}
                                                <span>{formatDiscount(code)}</span>
                                            </span>

                                            {expired && <span className="text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded">SCADUTO</span>}
                                            {maxed && <span className="text-xs bg-orange-900/30 text-orange-400 px-2 py-0.5 rounded">ESAURITO</span>}
                                            {!code.active && <span className="text-xs bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded">DISATTIVO</span>}
                                        </div>

                                        {code.description && <p className="text-sm text-zinc-400 mb-2">{code.description}</p>}

                                        <div className="flex items-center flex-wrap gap-2 text-xs text-zinc-500">
                                            {code.applicable_tiers && code.applicable_tiers.length > 0 ? (
                                                <span className="flex items-center space-x-1">
                                                    <span>Tier:</span>
                                                    {code.applicable_tiers.map(t => <span key={t}>{getTierBadge(t)}</span>)}
                                                </span>
                                            ) : (
                                                <span className="text-green-400">✓ Tutti i tier</span>
                                            )}
                                            {code.max_uses && (
                                                <span>• Utilizzi: {code.uses_count}/{code.max_uses}</span>
                                            )}
                                            {code.valid_until && (
                                                <span>• Scade: {new Date(code.valid_until).toLocaleDateString('it-IT')}</span>
                                            )}
                                            {code.min_purchase_amount && (
                                                <span>• Min: €{code.min_purchase_amount / 100}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleToggleActive(code.id, code.active)}
                                            className={`p-2 rounded transition-colors ${code.active ? 'text-green-400 hover:bg-green-900/20' : 'text-zinc-500 hover:bg-zinc-800'}`}
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(code.id)}
                                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* FORM MODAL */}
            {showForm && (
                <PromoCodeFormModal
                    code={editingCode}
                    generateCode={generateRandomCode}
                    onClose={() => setShowForm(false)}
                    onSave={() => { setShowForm(false); fetchPromoCodes(); }}
                />
            )}
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-lg space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">{code ? 'Modifica Codice' : 'Nuovo Codice Sconto'}</h2>
                    <button type="button" onClick={onClose} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                </div>

                <div className="flex space-x-2">
                    <input type="text" placeholder="CODICE" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} required
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white font-mono text-lg uppercase" />
                    <button type="button" onClick={() => setForm(f => ({ ...f, code: generateCode() }))}
                        className="px-4 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm font-bold">
                        🎲 Random
                    </button>
                </div>

                <input type="text" placeholder="Descrizione (opzionale)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white" />

                <div className="grid grid-cols-2 gap-4">
                    <select value={form.discount_type} onChange={e => setForm(f => ({ ...f, discount_type: e.target.value as 'percentage' | 'fixed_amount' }))}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white">
                        <option value="percentage">Percentuale (%)</option>
                        <option value="fixed_amount">Importo Fisso (€)</option>
                    </select>
                    <input
                        type="number"
                        placeholder={form.discount_type === 'percentage' ? 'Es: 20' : 'Es: 5000 (€50)'}
                        value={form.discount_value}
                        onChange={e => setForm(f => ({ ...f, discount_value: parseInt(e.target.value) || 0 }))}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white"
                    />
                </div>

                <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Tier Applicabili (vuoto = tutti)</label>
                    <div className="flex space-x-2">
                        {['matrice-1', 'matrice-2', 'ascension-box'].map(tier => (
                            <button key={tier} type="button" onClick={() => toggleTier(tier)}
                                className={`px-3 py-1 rounded border text-xs font-bold ${selectedTiers.includes(tier) ? 'bg-green-600 border-green-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>
                                {tier.replace('matrice-', 'M').replace('ascension-box', 'Ascension')}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Max Utilizzi (vuoto = illimitato)" value={form.max_uses || ''} onChange={e => setForm(f => ({ ...f, max_uses: e.target.value ? parseInt(e.target.value) : null }))}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white" />
                    <input type="date" value={form.valid_until} onChange={e => setForm(f => ({ ...f, valid_until: e.target.value }))}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white" />
                </div>

                <input type="number" placeholder="Acquisto Minimo in cents (es: 5000 = €50)" value={form.min_purchase_amount || ''} onChange={e => setForm(f => ({ ...f, min_purchase_amount: e.target.value ? parseInt(e.target.value) : null }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white" />

                <label className="flex items-center space-x-2 text-zinc-400">
                    <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="rounded" />
                    <span>Attivo Immediatamente</span>
                </label>

                <button type="submit" disabled={saving} className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg disabled:opacity-50">
                    {saving ? 'Salvataggio...' : (code ? 'Aggiorna' : 'Crea Codice')}
                </button>
            </form>
        </div>
    );
};
