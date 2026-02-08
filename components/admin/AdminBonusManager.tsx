import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Lock, Unlock, DollarSign, Eye, TrendingUp, Plus, Edit2, Trash2, Users } from 'lucide-react';

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

    useEffect(() => {
        fetchBonuses();
        fetchUsers();
    }, [filter]);

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
        // Fetch users for assignment (admin only)
        const { data, error } = await supabase.auth.admin.listUsers();
        if (!error && data) {
            setUsers(data.users.map(u => ({ id: u.id, email: u.email || 'No email' })));
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to hide this bonus?')) return;

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
            alert('Select at least one user');
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
                alert('Bonus assigned successfully!');
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

    return (
        <div className="admin-bonus-manager p-6">
            <div className="header flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">🎁 Bonus & Extras Manager</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Create New
                </button>
            </div>

            {/* Filters */}
            <div className="filters flex gap-4 mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('bonus')}
                    className={`px-4 py-2 rounded ${filter === 'bonus' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                >
                    Free Bonuses
                </button>
                <button
                    onClick={() => setFilter('extra')}
                    className={`px-4 py-2 rounded ${filter === 'extra' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                >
                    Paid Extras
                </button>
            </div>

            {/* Bonuses Table */}
            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-4 text-left">Icon</th>
                                <th className="p-4 text-left">Title</th>
                                <th className="p-4 text-left">Type</th>
                                <th className="p-4 text-left">Price</th>
                                <th className="p-4 text-left">Sales</th>
                                <th className="p-4 text-left">Revenue</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bonuses.map(bonus => (
                                <tr key={bonus.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 text-2xl">{bonus.icon}</td>
                                    <td className="p-4">
                                        <div className="font-semibold">{bonus.title}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                            {bonus.description}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {bonus.is_purchasable ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded">
                                                <DollarSign size={14} />
                                                Extra
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded">
                                                <Unlock size={14} />
                                                Bonus
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {bonus.is_purchasable
                                            ? `€${(bonus.price_cents / 100).toFixed(2)}`
                                            : 'FREE'}
                                    </td>
                                    <td className="p-4">{bonus.total_sales || 0}</td>
                                    <td className="p-4">
                                        €{((bonus.total_revenue_cents || 0) / 100).toFixed(2)}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2 justify-end">
                                            {!bonus.is_purchasable && (
                                                <button
                                                    onClick={() => openAssignModal(bonus.id)}
                                                    className="p-2 hover:bg-blue-100 rounded"
                                                    title="Assign to users"
                                                >
                                                    <Users size={18} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setEditingBonus(bonus)}
                                                className="p-2 hover:bg-gray-200 rounded"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(bonus.id)}
                                                className="p-2 hover:bg-red-100 text-red-600 rounded"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {bonuses.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No bonuses found. Create your first one!
                        </div>
                    )}
                </div>
            )}

            {/* Assign Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Assign Bonus to Users</h2>
                        <div className="space-y-2 mb-4">
                            {users.map(user => (
                                <label key={user.id} className="flex items-center gap-2">
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
                                    />
                                    <span className="text-sm">{user.email}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleAssign}
                                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >
                                Assign
                            </button>
                            <button
                                onClick={() => {
                                    setShowAssignModal(false);
                                    setSelectedUserIds([]);
                                }}
                                className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal would go here - keeping simple for now */}
        </div>
    );
}
