import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Activity, TrendingUp, ShoppingCart, Clock } from 'lucide-react';
import { supabase } from '../../services/supabase';

interface KPIData {
    totalUsers: number;
    payingUsers: number;
    newUsers7d: number;
    totalRevenue: number;
    recentPurchases: any[];
}

export const AdminOverview: React.FC = () => {
    const [kpiData, setKpiData] = useState<KPIData>({
        totalUsers: 0,
        payingUsers: 0,
        newUsers7d: 0,
        totalRevenue: 0,
        recentPurchases: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch user stats
            const { data: userStats } = await supabase
                .from('admin_user_stats')
                .select('*')
                .single();

            // Fetch revenue data
            const { data: revenueData } = await supabase
                .from('admin_revenue_overview')
                .select('*')
                .order('date', { ascending: false })
                .limit(30);

            // Fetch recent purchases
            const { data: purchases } = await supabase
                .from('purchases')
                .select('*, profiles(full_name, email)')
                .order('purchase_timestamp', { ascending: false })
                .limit(10);

            // Calculate total revenue
            const totalRevenue = revenueData?.reduce((sum, day) => sum + (day.revenue_cents || 0), 0) || 0;

            setKpiData({
                totalUsers: userStats?.total_users || 0,
                payingUsers: userStats?.paying_users || 0,
                newUsers7d: userStats?.new_users_7d || 0,
                totalRevenue: totalRevenue / 100,
                recentPurchases: purchases || []
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    const getCourseName = (courseId: string) => {
        const names: Record<string, string> = {
            'matrice-1': 'Storytelling Strategy',
            'matrice-2': 'Vox Podcast Master',
            'ascension-box': 'Ascension Box'
        };
        return names[courseId] || courseId;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black tracking-tighter text-white">
                    VISTA ELICOTTERO <span className="text-red-600">GOD MODE</span>
                </h1>
                <button
                    onClick={fetchDashboardData}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors"
                >
                    ↻ Aggiorna
                </button>
            </div>

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Utenti Totali"
                    value={kpiData.totalUsers.toLocaleString()}
                    icon={<Users className="text-blue-500" size={24} />}
                    subtitle="Nel sistema"
                />
                <KPICard
                    title="Utenti Paganti"
                    value={kpiData.payingUsers.toLocaleString()}
                    icon={<ShoppingCart className="text-green-500" size={24} />}
                    subtitle={`${kpiData.totalUsers > 0 ? Math.round((kpiData.payingUsers / kpiData.totalUsers) * 100) : 0}% conversion`}
                />
                <KPICard
                    title="Nuovi (7gg)"
                    value={kpiData.newUsers7d.toLocaleString()}
                    icon={<TrendingUp className="text-purple-500" size={24} />}
                    subtitle="Ultimi 7 giorni"
                />
                <KPICard
                    title="Revenue Totale"
                    value={formatCurrency(kpiData.totalRevenue)}
                    icon={<DollarSign className="text-yellow-500" size={24} />}
                    subtitle="Ultimi 30 giorni"
                    highlight
                />
            </div>

            {/* RECENT ACTIVITY */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-300">Acquisti Recenti</h2>
                    <span className="text-xs text-zinc-500 font-mono">LIVE FEED</span>
                </div>
                <div className="space-y-3">
                    {kpiData.recentPurchases.length === 0 ? (
                        <p className="text-zinc-500 text-center py-8">Nessun acquisto recente.</p>
                    ) : (
                        kpiData.recentPurchases.map((purchase) => (
                            <div
                                key={purchase.id}
                                className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 rounded-lg px-3 transition-colors"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 flex items-center justify-center border border-yellow-500/30">
                                        <DollarSign size={16} className="text-yellow-500" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-zinc-200">
                                            {purchase.profiles?.full_name || purchase.email}
                                        </div>
                                        <div className="text-xs text-zinc-500">
                                            {getCourseName(purchase.course_id)}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-green-400">
                                        {formatCurrency(purchase.amount / 100)}
                                    </div>
                                    <div className="text-xs text-zinc-600 flex items-center justify-end">
                                        <Clock size={10} className="mr-1" />
                                        {new Date(purchase.purchase_timestamp).toLocaleDateString('it-IT')}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const KPICard = ({ title, value, icon, subtitle, highlight }: {
    title: string;
    value: string;
    icon: React.ReactNode;
    subtitle?: string;
    highlight?: boolean;
}) => (
    <div className={`bg-zinc-900/50 border p-6 rounded-xl hover:bg-zinc-900 transition-colors group ${highlight ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-zinc-800'}`}>
        <div className="flex justify-between items-start mb-4">
            <div className="bg-black/40 p-3 rounded-lg group-hover:bg-black/60 transition-colors">
                {icon}
            </div>
        </div>
        <p className="text-zinc-500 text-sm font-medium">{title}</p>
        <h3 className={`text-2xl font-bold mt-1 ${highlight ? 'text-yellow-400' : 'text-white'}`}>{value}</h3>
        {subtitle && <p className="text-xs text-zinc-600 mt-1">{subtitle}</p>}
    </div>
);
