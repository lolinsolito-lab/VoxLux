import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Search, Shield, Ban, Unlock, MoreVertical, Loader } from 'lucide-react';

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
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

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBanUser = async (userId: string) => {
        if (!confirm('SEI SICURO? Bannare questo utente bloccherà il suo accesso.')) return;

        try {
            // In a real scenario, this would likely call an Edge Function to disable auth.users entry too.
            // For now, we just mark the profile role as 'banned' (if supported) or similar.
            // But since 'banned' isn't in our enum, we might need to add it or just remove 'user' role.
            // Let's assume we want to DOWNGRADE them to 'user' if they were admin, or maybe just log it.
            // ACTUALLY, let's just log it for now as a "Mock Action" until we deciding on 'banned' role.
            console.log('Banning user:', userId);
            alert('Funzionalità Ban in arrivo (Richiede Edge Function).');
        } catch (error) {
            console.error('Error banning user:', error);
        }
    };

    const handleGrantAccess = async (userId: string) => {
        const courseId = prompt('Inserisci ID corso da sbloccare (es. matrice-1, ascension-box):', 'ascension-box');
        if (!courseId) return;

        try {
            // Direct insert into purchases (Admin Privilege via RLS)
            const { error } = await supabase.from('purchases').insert({
                user_id: userId,
                email: users.find(u => u.id === userId)?.email || 'admin_grant@system',
                course_id: courseId,
                amount: 0,
                status: 'active',
                stripe_payment_id: `admin_grant_${Date.now()}`
            });

            if (error) throw error;
            alert(`Accesso a ${courseId} garantito con successo!`);
        } catch (error) {
            console.error('Error granting access:', error);
            alert('Errore sblocco corso: ' + error.message);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter">
                        TUTTO INTERNETO <span className="text-zinc-500 text-lg font-mono ml-2">({users.length})</span>
                    </h1>
                    <p className="text-zinc-400 text-sm">Gestione utenti e permessi God Mode.</p>
                </div>

                <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                    <button
                        onClick={() => setFilterRole('all')}
                        className={`px-3 py-1.5 text-xs font-bold rounded ${filterRole === 'all' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                    >
                        TUTTI
                    </button>
                    <button
                        onClick={() => setFilterRole('admin')}
                        className={`px-3 py-1.5 text-xs font-bold rounded ${filterRole === 'admin' ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-red-500'}`}
                    >
                        ADMIN
                    </button>
                    <button
                        onClick={() => setFilterRole('user')}
                        className={`px-3 py-1.5 text-xs font-bold rounded ${filterRole === 'user' ? 'bg-blue-600 text-white' : 'text-zinc-500 hover:text-blue-500'}`}
                    >
                        USER
                    </button>
                </div>
            </div>

            {/* SEARCH BAR */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500" size={20} />
                <input
                    type="text"
                    placeholder="Cerca per email, nome o ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-900/50 transition-all font-mono"
                />
            </div>

            {/* USERS TABLE */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-800 bg-black/40">
                                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Utente</th>
                                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Ruolo</th>
                                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Livello / XP</th>
                                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Iscrizione</th>
                                <th className="p-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                                        <Loader className="animate-spin mx-auto mb-2" />
                                        Caricamento matrice utenti...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                                        Nessun utente trovato.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-xs font-bold text-white uppercase">
                                                    {user.email.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-200">{user.full_name || 'Senza Nome'}</div>
                                                    <div className="text-xs text-zinc-500 font-mono">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase tracking-wide
                                                ${user.role === 'god' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50' :
                                                    user.role === 'admin' ? 'bg-red-500/20 text-red-500 border border-red-500/50' :
                                                        'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                                                {user.role === 'god' && <Shield size={10} className="mr-1" />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-medium text-zinc-300">Lvl {user.level ?? 1}</div>
                                            <div className="text-xs text-zinc-600">{(user.xp ?? 0).toLocaleString()} XP</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm text-zinc-400">
                                                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleGrantAccess(user.id)}
                                                    className="p-2 text-zinc-500 hover:text-green-500 hover:bg-green-900/20 rounded transition-colors"
                                                    title="Grant Access"
                                                >
                                                    <Unlock size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleBanUser(user.id)}
                                                    className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-900/20 rounded transition-colors"
                                                    title="Ban User"
                                                >
                                                    <Ban size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
