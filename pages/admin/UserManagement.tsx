import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../services/supabase';
import { Search, Shield, Ban, Unlock, Users, Mail, Calendar, TrendingUp, Crown, Zap, Award } from 'lucide-react';

interface UserProfile {
    id: string;
    email: string;
    name?: string;
    full_name?: string;
    role: string;
    level: number;
    xp: number;
    created_at: string;
}

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [quizStats, setQuizStats] = useState<Record<string, number>>({});

    useEffect(() => {
        fetchUsers();
        setupRealtime();
    }, []);

    const setupRealtime = () => {
        const channel = supabase
            .channel('profiles-updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
                fetchUsers();
            })
            .subscribe();

        return () => { channel.unsubscribe(); };
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(profiles || []);

            // Fetch Quiz Stats
            const { data: results } = await supabase
                .from('quiz_results')
                .select('user_id, passed')
                .eq('passed', true);

            const stats: Record<string, number> = {};
            results?.forEach(r => {
                stats[r.user_id] = (stats[r.user_id] || 0) + 1;
            });
            setQuizStats(stats);

        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBanUser = async (userId: string) => {
        if (!confirm('SEI SICURO? Bannare questo utente bloccherà il suo accesso.')) return;
        console.log('Banning user:', userId);
        alert('Funzionalità Ban in arrivo (Richiede Edge Function).');
    };

    const handleGrantAccess = async (userId: string) => {
        const courseId = prompt('Inserisci ID corso da sbloccare (es. matrice-1, ascension-box):', 'ascension-box');
        if (!courseId) return;

        try {
            const user = users.find(u => u.id === userId);
            const { error } = await supabase.from('purchases').insert({
                user_id: userId,
                email: user?.email || 'admin_grant@system',
                course_id: courseId,
                amount: 0,
                status: 'active',
                stripe_payment_id: `admin_grant_${Date.now()}`
            });

            if (error) throw error;
            alert(`Accesso a ${courseId} garantito con successo!`);
        } catch (error: any) {
            console.error('Error granting access:', error);
            alert('Errore sblocco corso: ' + error.message);
        }
    };

    const filteredUsers = users.filter(user => {
        const displayName = user.full_name || user.name || '';
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            displayName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role: string) => {
        const configs: Record<string, { bg: string; text: string; border: string; icon: any }> = {
            god: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', icon: Crown },
            admin: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: Shield },
            user: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', icon: Users }
        };
        const config = configs[role] || configs.user;
        const Icon = config.icon;

        return (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${config.bg} ${config.text} border ${config.border} font-bold text-xs uppercase`}>
                <Icon size={14} />
                {role}
            </div>
        );
    };

    const totalUsers = users.length;
    const adminUsers = users.filter(u => u.role === 'admin' || u.role === 'god').length;
    const regularUsers = users.filter(u => u.role === 'user').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8 space-y-8">
            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-5xl font-black tracking-tighter">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
                            USER MANAGEMENT
                        </span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">Gestione utenti e permessi God Mode.</p>
                </div>

                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                    <button
                        onClick={() => setFilterRole('all')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filterRole === 'all' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        TUTTI
                    </button>
                    <button
                        onClick={() => setFilterRole('admin')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filterRole === 'admin' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-red-500'
                            }`}
                    >
                        ADMIN
                    </button>
                    <button
                        onClick={() => setFilterRole('user')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filterRole === 'user' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-blue-500'
                            }`}
                    >
                        USER
                    </button>
                </div>
            </motion.div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="backdrop-blur-sm bg-gradient-to-br from-purple-500/10 to-purple-700/5 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-3 bg-purple-500/20 rounded-xl backdrop-blur-sm">
                            <Users className="text-purple-400" size={24} />
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-purple-600/20 border border-purple-500/30 rounded-lg">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-purple-400 font-bold">LIVE</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">Utenti Totali</p>
                    <h3 className="text-4xl font-black text-purple-400">{totalUsers}</h3>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="backdrop-blur-sm bg-gradient-to-br from-red-500/10 to-red-700/5 border border-red-500/30 rounded-2xl p-6 hover:border-red-500/50 transition-all duration-300 hover:scale-105"
                >
                    <div className="p-3 bg-red-500/20 rounded-xl backdrop-blur-sm mb-3">
                        <Shield className="text-red-400" size={24} />
                    </div>
                    <p className="text-sm text-gray-400 mb-1">Admin</p>
                    <h3 className="text-4xl font-black text-red-400">{adminUsers}</h3>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="backdrop-blur-sm bg-gradient-to-br from-blue-500/10 to-blue-700/5 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
                >
                    <div className="p-3 bg-blue-500/20 rounded-xl backdrop-blur-sm mb-3">
                        <TrendingUp className="text-blue-400" size={24} />
                    </div>
                    <p className="text-sm text-gray-400 mb-1">Regular Users</p>
                    <h3 className="text-4xl font-black text-blue-400">{regularUsers}</h3>
                </motion.div>
            </div>

            {/* SEARCH BAR */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
            >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                    type="text"
                    placeholder="Cerca per email, nome o ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-all font-mono"
                />
            </motion.div>

            {/* USERS GRID */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
                {filteredUsers.length === 0 ? (
                    <div className="col-span-full text-center py-20 backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl">
                        <Users size={64} className="mx-auto mb-4 text-gray-600" />
                        <p className="text-gray-400 text-lg mb-2">Nessun utente trovato.</p>
                        <p className="text-sm text-gray-500">Prova a cambiare i filtri di ricerca.</p>
                    </div>
                ) : (
                    filteredUsers.map((user, index) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group"
                        >
                            {/* AVATAR & NAME */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-lg font-black text-purple-400 uppercase">
                                        {user.email.substring(0, 2)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">
                                            {user.full_name || user.name || 'Senza Nome'}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Mail size={12} />
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                                {getRoleBadge(user.role)}
                            </div>

                            {/* STATS */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-white/5 rounded-xl p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Zap size={14} className="text-amber-400" />
                                        <span className="text-xs text-gray-400">Level</span>
                                    </div>
                                    <p className="text-xl font-bold text-white">{user.level ?? 1}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <TrendingUp size={14} className="text-green-400" />
                                        <span className="text-xs text-gray-400">XP</span>
                                    </div>
                                    <p className="text-xl font-bold text-white">{(user.xp ?? 0).toLocaleString()}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3 col-span-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Award size={14} className="text-purple-400" />
                                        <span className="text-xs text-gray-400">Diplomi / Quiz</span>
                                    </div>
                                    <p className="text-xl font-bold text-white">{quizStats[user.id] || 0}</p>
                                </div>
                            </div>

                            {/* DATE */}
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 px-3 py-2 bg-white/5 rounded-lg">
                                <Calendar size={12} />
                                Iscritto: {user.created_at ? new Date(user.created_at).toLocaleDateString('it-IT') : 'N/A'}
                            </div>

                            {/* ACTIONS */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleGrantAccess(user.id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600/20 border border-green-500/30 text-green-400 rounded-xl hover:bg-green-600/30 transition-all duration-300 font-bold text-sm"
                                >
                                    <Unlock size={16} />
                                    Grant Access
                                </button>
                                <button
                                    onClick={() => handleBanUser(user.id)}
                                    className="p-2.5 bg-red-600/20 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-600/30 transition-all duration-300"
                                    title="Ban User"
                                >
                                    <Ban size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </motion.div>
        </div>
    );
};
