import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Gift, ShoppingBag, ExternalLink, FileText, Video, Music, RefreshCw, X, Check } from 'lucide-react';
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
    const [activeTab, setActiveTab] = useState<'bonuses' | 'upsells'>('bonuses');
    const [bonuses, setBonuses] = useState<BonusProduct[]>([]);
    const [upsells, setUpsells] = useState<UpsellProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingBonus, setEditingBonus] = useState<BonusProduct | null>(null);
    const [editingUpsell, setEditingUpsell] = useState<UpsellProduct | null>(null);
    const [showBonusForm, setShowBonusForm] = useState(false);
    const [showUpsellForm, setShowUpsellForm] = useState(false);

    useEffect(() => {
        fetchData();
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
            case 'vimeo': return <Video size={14} className="text-red-400" />;
            case 'supabase_storage':
            case 'download_link': return <FileText size={14} className="text-blue-400" />;
            case 'external_url': return <ExternalLink size={14} className="text-green-400" />;
            default: return <Gift size={14} className="text-yellow-400" />;
        }
    };

    const getTierBadge = (tier: string) => {
        const colors: Record<string, string> = {
            'matrice-1': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            'matrice-2': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            'ascension-box': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
        };
        const names: Record<string, string> = {
            'matrice-1': 'Story',
            'matrice-2': 'Podcast',
            'ascension-box': 'Ascension'
        };
        return (
            <span className={`px-2 py-0.5 text-xs font-bold rounded border ${colors[tier] || 'bg-zinc-800 text-zinc-400'}`}>
                {names[tier] || tier}
            </span>
        );
    };

    const formatPrice = (cents: number) => `€${(cents / 100).toFixed(0)}`;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black tracking-tighter text-white">
                    LA FABBRICA <span className="text-purple-500">CONTENUTI</span>
                </h1>
                <button onClick={fetchData} className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg transition-colors">
                    <RefreshCw size={16} />
                </button>
            </div>

            {/* TABS */}
            <div className="flex space-x-2 border-b border-zinc-800 pb-2">
                <button
                    onClick={() => setActiveTab('bonuses')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg font-bold text-sm transition-colors ${activeTab === 'bonuses' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'
                        }`}
                >
                    <Gift size={16} />
                    <span>Bonus ({bonuses.length})</span>
                </button>
                <button
                    onClick={() => setActiveTab('upsells')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg font-bold text-sm transition-colors ${activeTab === 'upsells' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'
                        }`}
                >
                    <ShoppingBag size={16} />
                    <span>Upsells ({upsells.length})</span>
                </button>
            </div>

            {/* BONUSES TAB */}
            {activeTab === 'bonuses' && (
                <div className="space-y-4">
                    <button
                        onClick={() => { setEditingBonus(null); setShowBonusForm(true); }}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold text-sm transition-colors"
                    >
                        <Plus size={16} />
                        <span>Nuovo Bonus</span>
                    </button>

                    <div className="grid gap-4">
                        {bonuses.map((bonus) => (
                            <div key={bonus.id} className={`bg-zinc-900/50 border rounded-xl p-4 ${bonus.active ? 'border-zinc-800' : 'border-red-900/30 opacity-60'}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            {getDeliveryIcon(bonus.delivery_type)}
                                            <h3 className="font-bold text-white">{bonus.name}</h3>
                                            {!bonus.active && <span className="text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded">INATTIVO</span>}
                                        </div>
                                        <p className="text-sm text-zinc-400 mb-3">{bonus.description}</p>
                                        <div className="flex items-center space-x-2">
                                            {bonus.tier_applicable?.map(tier => (
                                                <span key={tier}>{getTierBadge(tier)}</span>
                                            ))}
                                            <span className="text-xs text-zinc-600">• Finestra: {bonus.eligibility_hours}h</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleToggleBonusActive(bonus.id, bonus.active)}
                                            className={`p-2 rounded transition-colors ${bonus.active ? 'text-green-400 hover:bg-green-900/20' : 'text-zinc-500 hover:bg-zinc-800'}`}
                                            title={bonus.active ? 'Disattiva' : 'Attiva'}
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            onClick={() => { setEditingBonus(bonus); setShowBonusForm(true); }}
                                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBonus(bonus.id)}
                                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* UPSELLS TAB */}
            {activeTab === 'upsells' && (
                <div className="space-y-4">
                    <button
                        onClick={() => { setEditingUpsell(null); setShowUpsellForm(true); }}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold text-sm transition-colors"
                    >
                        <Plus size={16} />
                        <span>Nuovo Upsell</span>
                    </button>

                    <div className="grid gap-4">
                        {upsells.map((upsell) => (
                            <div key={upsell.id} className={`bg-zinc-900/50 border rounded-xl p-4 ${upsell.active ? 'border-zinc-800' : 'border-red-900/30 opacity-60'}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <h3 className="font-bold text-white">{upsell.name}</h3>
                                            {upsell.badge && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">{upsell.badge}</span>}
                                            {!upsell.active && <span className="text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded">INATTIVO</span>}
                                        </div>
                                        <p className="text-sm text-zinc-400 mb-3">{upsell.description}</p>
                                        <div className="flex items-center space-x-4">
                                            <span className="font-bold text-green-400 text-lg">{formatPrice(upsell.price)}</span>
                                            <span className="text-xs text-zinc-600 font-mono">{upsell.stripe_price_id || 'No Stripe ID'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleToggleUpsellActive(upsell.id, upsell.active)}
                                            className={`p-2 rounded transition-colors ${upsell.active ? 'text-green-400 hover:bg-green-900/20' : 'text-zinc-500 hover:bg-zinc-800'}`}
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            onClick={() => { setEditingUpsell(upsell); setShowUpsellForm(true); }}
                                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUpsell(upsell.id)}
                                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* BONUS FORM MODAL */}
            {showBonusForm && (
                <BonusFormModal
                    bonus={editingBonus}
                    onClose={() => setShowBonusForm(false)}
                    onSave={() => { setShowBonusForm(false); fetchData(); }}
                />
            )}

            {/* UPSELL FORM MODAL */}
            {showUpsellForm && (
                <UpsellFormModal
                    upsell={editingUpsell}
                    onClose={() => setShowUpsellForm(false)}
                    onSave={() => { setShowUpsellForm(false); fetchData(); }}
                />
            )}
        </div>
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-lg space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">{bonus ? 'Modifica Bonus' : 'Nuovo Bonus'}</h2>
                    <button type="button" onClick={onClose} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                </div>

                <input type="text" placeholder="Nome" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white" />
                <textarea placeholder="Descrizione" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white h-20" />

                <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Tier Applicabili</label>
                    <div className="flex space-x-2">
                        {['matrice-1', 'matrice-2', 'ascension-box'].map(tier => (
                            <button key={tier} type="button" onClick={() => toggleTier(tier)}
                                className={`px-3 py-1 rounded border text-xs font-bold ${form.tier_applicable.includes(tier) ? 'bg-purple-600 border-purple-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>
                                {tier.replace('matrice-', 'M').replace('ascension-box', 'Ascension')}
                            </button>
                        ))}
                    </div>
                </div>

                <select value={form.delivery_type} onChange={e => setForm(f => ({ ...f, delivery_type: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white">
                    <option value="supabase_storage">Supabase Storage</option>
                    <option value="external_url">Link Esterno</option>
                    <option value="youtube">YouTube</option>
                    <option value="vimeo">Vimeo</option>
                    <option value="download_link">Download Link</option>
                </select>

                <input type="text" placeholder="URL Contenuto" value={form.content_url} onChange={e => setForm(f => ({ ...f, content_url: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white" />

                <div className="flex items-center justify-between">
                    <input type="number" placeholder="Ore Eleggibilità" value={form.eligibility_hours} onChange={e => setForm(f => ({ ...f, eligibility_hours: parseInt(e.target.value) || 24 }))}
                        className="w-32 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white" />
                    <label className="flex items-center space-x-2 text-zinc-400">
                        <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="rounded" />
                        <span>Attivo</span>
                    </label>
                </div>

                <button type="submit" disabled={saving} className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg disabled:opacity-50">
                    {saving ? 'Salvataggio...' : (bonus ? 'Aggiorna' : 'Crea')}
                </button>
            </form>
        </div>
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-lg space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">{upsell ? 'Modifica Upsell' : 'Nuovo Upsell'}</h2>
                    <button type="button" onClick={onClose} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                </div>

                <input type="text" placeholder="Nome" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white" />
                <textarea placeholder="Descrizione" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white h-20" />

                <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Prezzo (cents)" value={form.price} onChange={e => setForm(f => ({ ...f, price: parseInt(e.target.value) || 0 }))}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white" />
                    <input type="text" placeholder="Stripe Price ID" value={form.stripe_price_id} onChange={e => setForm(f => ({ ...f, stripe_price_id: e.target.value }))}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Ordine Display" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white" />
                    <input type="text" placeholder="Badge (es. POPULAR)" value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white" />
                </div>

                <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Disponibile per Tier</label>
                    <div className="flex space-x-2">
                        {['matrice-1', 'matrice-2', 'ascension-box'].map(tier => (
                            <button key={tier} type="button" onClick={() => toggleTier(tier)}
                                className={`px-3 py-1 rounded border text-xs font-bold ${form.available_for_tiers.includes(tier) ? 'bg-green-600 border-green-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>
                                {tier.replace('matrice-', 'M').replace('ascension-box', 'Ascension')}
                            </button>
                        ))}
                    </div>
                </div>

                <label className="flex items-center space-x-2 text-zinc-400">
                    <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="rounded" />
                    <span>Attivo</span>
                </label>

                <button type="submit" disabled={saving} className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg disabled:opacity-50">
                    {saving ? 'Salvataggio...' : (upsell ? 'Aggiorna' : 'Crea')}
                </button>
            </form>
        </div>
    );
};
