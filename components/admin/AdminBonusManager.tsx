import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Lock, Unlock, DollarSign, Eye, TrendingUp, Plus, Edit2, Trash2, Users, BarChart3, ShoppingCart, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BonusContent {
    id: string;
    title: string;
    description: string;
    icon: string;
    delivery_type: string;
    content_url: string;
    action_label: string;
    is_purchasable: boolean;
    price_cents: number;
    total_sales: number;
    total_revenue_cents: number;
    is_visible: boolean;
    order_index: number;
}

interface User {
    id: string;
    email: string;
}

interface Analytics {
    total_revenue: number;
    total_sales: number;
    avg_order_value: number;
    conversion_rate: number;
}

export default function AdminBonusManager() {
    const [bonuses, setBonuses] = useState<BonusContent[]>([]);
    const [filter, setFilter] = useState<'all' | 'bonus' | 'extra'>('all');
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingBonus, setEditingBonus] = useState<BonusContent | null>(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [assigningBonusId, setAssigningBonusId] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [analytics, setAnalytics] = useState<Analytics>({
        total_revenue: 0,
        total_sales: 0,
        avg_order_value: 0,
        conversion_rate: 0
    });

    useEffect(() => {
        fetchBonuses();
        fetchUsers();
    }, [filter]);

    useEffect(() => {
        calculateAnalytics();
    }, [bonuses]);

    function calculateAnalytics() {
        const extras = bonuses.filter(b => b.is_purchasable);
        const totalRevenue = extras.reduce((sum, b) => sum + (b.total_revenue_cents || 0), 0);
        const totalSales = extras.reduce((sum, b) => sum + (b.total_sales || 0), 0);

        setAnalytics({
            total_revenue: totalRevenue / 100,
            total_sales: totalSales,
            avg_order_value: totalSales > 0 ? (totalRevenue / 100) / totalSales : 0,
            conversion_rate: 0 // Would need view data for this
        });
    }

    async function fetchBonuses() {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch(`/api/admin-bonuses?filter=${filter}`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setBonuses(data);
            }
        } catch (error) {
            console.error('Error fetching bonuses:', error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchUsers() {
        const { data, error } = await supabase.auth.admin.listUsers();
        if (!error && data) {
            setUsers(data.users.map(u => ({ id: u.id, email: u.email || 'No email' })));
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Sei sicuro di voler nascondere questo bonus?')) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch(`/api/admin-bonuses?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (response.ok) {
                fetchBonuses();
            }
        } catch (error) {
            console.error('Error deleting bonus:', error);
        }
    }

    async function handleAssign() {
        if (selectedUserIds.length === 0) {
            alert('Seleziona almeno un utente');
            return;
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch('/api/assign-bonus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    bonus_id: assigningBonusId,
                    user_ids: selectedUserIds
                })
            });

            if (response.ok) {
                alert('Bonus assegnato con successo!');
                setShowAssignModal(false);
                setSelectedUserIds([]);
            }
        } catch (error) {
            console.error('Error assigning bonus:', error);
        }
    }

    function openAssignModal(bonusId: string) {
        setAssigningBonusId(bonusId);
        setShowAssignModal(true);
    }

    const filteredBonuses = bonuses.filter(b => {
        if (filter === 'bonus') return !b.is_purchasable;
        if (filter === 'extra') return b.is_purchasable;
        return true;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                        LA FABBRICA CONTENUTI
                    </h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gradient-to-r from-amber-600 to-amber-500 text-black px-6 py-3 rounded-xl flex items-center gap-2 hover:from-amber-500 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-amber-500/50 font-bold"
                    >
                        <Plus size={20} />
                        Nuovo Bonus
                    </button>
                </div>
                <p className="text-gray-400 text-lg">Centro comando per Bonus e Extra Premium</p>
            </motion.div>

            {/* Analytics Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            >
                {/* Total Revenue */}
                <div className="backdrop-blur-xl bg-gradient-to-br from-green-900/20 to-emerald-900/10 border border-green-500/30 rounded-2xl p-6 hover:border-green-500/60 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign className="text-green-400" size={32} />
                        <span className="text-xs text-green-400 font-semibold">TOTALE</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">
                        €{analytics.total_revenue.toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-400">Revenue Generata</p>
                </div>

                {/* Total Sales */}
                <div className="backdrop-blur-xl bg-gradient-to-br from-blue-900/20 to-indigo-900/10 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/60 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <ShoppingCart className="text-blue-400" size={32} />
                        <span className="text-xs text-blue-400 font-semibold">VENDITE</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">
                        {analytics.total_sales}
                    </div>
                    <p className="text-sm text-gray-400">Extra Venduti</p>
                </div>

                {/* Average Order Value */}
                <div className="backdrop-blur-xl bg-gradient-to-br from-purple-900/20 to-pink-900/10 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/60 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="text-purple-400" size={32} />
                        <span className="text-xs text-purple-400 font-semibold">AOV</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">
                        €{analytics.avg_order_value.toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-400">Scontrino Medio</p>
                </div>

                {/* Active Items */}
                <div className="backdrop-blur-xl bg-gradient-to-br from-amber-900/20 to-orange-900/10 border border-amber-500/30 rounded-2xl p-6 hover:border-amber-500/60 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <BarChart3 className="text-amber-400" size={32} />
                        <span className="text-xs text-amber-400 font-semibold">ATTIVI</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">
                        {bonuses.length}
                    </div>
                    <p className="text-sm text-gray-400">Contenuti Totali</p>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex gap-4 mb-8"
            >
                <button
                    onClick={() => setFilter('all')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${filter === 'all'
                            ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-black shadow-lg shadow-amber-500/50'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                >
                    Tutti ({bonuses.length})
                </button>
                <button
                    onClick={() => setFilter('bonus')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${filter === 'bonus'
                            ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg shadow-green-500/50'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                >
                    Bonus Gratuiti ({bonuses.filter(b => !b.is_purchasable).length})
                </button>
                <button
                    onClick={() => setFilter('extra')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${filter === 'extra'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                >
                    Extra Premium ({bonuses.filter(b => b.is_purchasable).length})
                </button>
            </motion.div>

            {/* Content Cards */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                    <AnimatePresence>
                        {filteredBonuses.map((bonus, index) => (
                            <motion.div
                                key={bonus.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className="backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-amber-500/50 transition-all duration-300 group hover:shadow-2xl hover:shadow-amber-500/10"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="text-4xl">{bonus.icon}</div>
                                        <div>
                                            {bonus.is_purchasable ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xs font-bold">
                                                    <DollarSign size={12} />
                                                    EXTRA
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-xs font-bold">
                                                    <Unlock size={12} />
                                                    BONUS
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Title & Description */}
                                <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                                    {bonus.title}
                                </h3>
                                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                                    {bonus.description}
                                </p>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-black/30 rounded-xl border border-white/5">
                                    <div>
                                        <div className="text-2xl font-bold text-amber-400">
                                            {bonus.is_purchasable ? `€${(bonus.price_cents / 100).toFixed(0)}` : 'GRATIS'}
                                        </div>
                                        <div className="text-xs text-gray-500">Prezzo</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-green-400">
                                            {bonus.total_sales || 0}
                                        </div>
                                        <div className="text-xs text-gray-500">Vendite</div>
                                    </div>
                                    {bonus.is_purchasable && (
                                        <>
                                            <div className="col-span-2 pt-2 border-t border-white/5">
                                                <div className="text-2xl font-bold text-emerald-400">
                                                    €{((bonus.total_revenue_cents || 0) / 100).toFixed(2)}
                                                </div>
                                                <div className="text-xs text-gray-500">Revenue Generata</div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {!bonus.is_purchasable && (
                                        <button
                                            onClick={() => openAssignModal(bonus.id)}
                                            className="flex-1 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-semibold"
                                            title="Assegna a utenti"
                                        >
                                            <Users size={16} />
                                            Assegna
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setEditingBonus(bonus)}
                                        className="flex-1 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-semibold"
                                    >
                                        <Edit2 size={16} />
                                        Modifica
                                    </button>
                                    <button
                                        onClick={() => handleDelete(bonus.id)}
                                        className="px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-600/30 transition-all duration-300"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {filteredBonuses.length === 0 && !loading && (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4 opacity-50">📦</div>
                    <p className="text-xl text-gray-400">Nessun contenuto trovato</p>
                    <p className="text-sm text-gray-500 mt-2">Crea il tuo primo bonus o extra premium!</p>
                </div>
            )}

            {/* Assign Modal */}
            <AnimatePresence>
                {showAssignModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowAssignModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gradient-to-br from-gray-900 to-black border border-amber-500/30 rounded-2xl p-8 max-w-md w-full max-h-96 overflow-y-auto shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Users className="text-amber-500" />
                                Assegna Bonus a Utenti
                            </h2>
                            <div className="space-y-3 mb-6">
                                {users.map(user => (
                                    <label key={user.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedUserIds.includes(user.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedUserIds([...selectedUserIds, user.id]);
                                                } else {
                                                    setSelectedUserIds(selectedUserIds.filter(id => id !== user.id));
                                                }
                                            }}
                                            className="w-5 h-5 accent-amber-500"
                                        />
                                        <span className="text-sm text-white">{user.email}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAssign}
                                    className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 text-black py-3 rounded-xl font-bold hover:from-amber-500 hover:to-amber-400 transition-all duration-300 shadow-lg"
                                >
                                    Assegna
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAssignModal(false);
                                        setSelectedUserIds([]);
                                    }}
                                    className="flex-1 bg-white/5 text-gray-300 py-3 rounded-xl font-bold hover:bg-white/10 transition-all duration-300"
                                >
                                    Annulla
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
