import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Activity, TrendingUp, ShoppingCart, Clock, RefreshCw, Zap, Eye, Calendar, ArrowUp, ArrowDown, Lock, LockOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../services/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useGodMode } from '../../hooks/useGodMode';

interface KPIData {
    totalUsers: number;
    payingUsers: number;
    newUsers7d: number;
    totalRevenue: number;
    recentPurchases: any[];
    revenueData: any[];
}

export const AdminOverview: React.FC = () => {
    const [kpiData, setKpiData] = useState<KPIData>({
        totalUsers: 0,
        payingUsers: 0,
        newUsers7d: 0,
        totalRevenue: 0,
        recentPurchases: [],
        revenueData: []
    });
    const [loading, setLoading] = useState(true);
    const [prevRevenue, setPrevRevenue] = useState(0);
    const { enabled: godMode, toggle: toggleGodMode } = useGodMode();

    useEffect(() => {
        fetchDashboardData();
        setupRealTimeSubscriptions();
    }, []);

    const setupRealTimeSubscriptions = () => {
        const channel = supabase
            .channel('admin-overview-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'purchases' }, () => fetchDashboardData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchDashboardData())
            .subscribe();

        return () => { channel.unsubscribe(); };
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch profiles count
            const { count: totalUsersCount } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            // Fetch paying users (unique emailsfrom purchases)
            const { data: purchases } = await supabase
                .from('purchases')
                .select('email');

            const uniquePayingUsers = new Set(purchases?.map(p => p.email)).size;

            // Fetch new users last 7 days
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const { count: newUsers7dCount } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', sevenDaysAgo.toISOString());

            // Fetch revenue data (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const { data: purchasesData } = await supabase
                .from('purchases')
                .select('*')
                .gte('purchase_timestamp', thirtyDaysAgo.toISOString())
                .order('purchase_timestamp', { ascending: true });

            // Group by date for chart
            const revenueByDate: Record<string, number> = {};
            let totalRevenue = 0;

            purchasesData?.forEach(p => {
                const date = new Date(p.purchase_timestamp).toLocaleDateString('it-IT', { month: 'short', day: 'numeric' });
                revenueByDate[date] = (revenueByDate[date] || 0) + (p.amount / 100);
                totalRevenue += p.amount / 100;
            });

            const chartData = Object.entries(revenueByDate).map(([date, revenue]) => ({
                date,
                revenue: Math.round(revenue)
            }));

            // Fetch recent purchases with profiles
            const { data: recentPurchases } = await supabase
                .from('purchases')
                .select('*, profiles(full_name, email)')
                .order('purchase_timestamp', { ascending: false })
                .limit(10);

            setKpiData({
                totalUsers: totalUsersCount || 0,
                payingUsers: uniquePayingUsers,
                newUsers7d: newUsers7dCount || 0,
                totalRevenue,
                recentPurchases: recentPurchases || [],
                revenueData: chartData
            });

            setPrevRevenue(totalRevenue);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(amount);
    };

    const getCourseName = (courseId: string) => {
        const names: Record<string, string> = {
            'matrice-1': 'Storytelling Matrice',
            'matrice-2': 'Podcast Matrice',
            'ascension-box': 'Ascension Box'
        };
        return names[courseId] || courseId;
    };

    const conversionRate = kpiData.totalUsers > 0 ? (kpiData.payingUsers / kpiData.totalUsers) * 100 : 0;
    const avgOrderValue = kpiData.payingUsers > 0 ? kpiData.totalRevenue / kpiData.payingUsers : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Caricamento dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 md:p-8 pb-20">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <div className="flex justify-between items-center mb-2 flex-wrap gap-4">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                        VISTA ELICOTTERO <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent block md:inline">GOD MODE</span>
                    </h1>
                    <div className="flex gap-4">
                        <button
                            onClick={toggleGodMode}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-bold border ${godMode ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'}`}
                        >
                            {godMode ? <LockOpen size={20} /> : <Lock size={20} />}
                            <span className="hidden md:inline">{godMode ? "GOD MODE: ON" : "GOD MODE: OFF"}</span>
                        </button>
                        <button
                            onClick={fetchDashboardData}
                            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-all duration-300 hover:scale-105 font-semibold"
                        >
                            <RefreshCw size={20} />
                            <span className="hidden md:inline">Aggiorna</span>
                        </button>
                    </div>
                </div>
                <p className="text-gray-400 text-lg">Comanda il tuo impero in tempo reale</p>
            </motion.div>

            {/* Main KPI Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            >
                <KPICard
                    title="Revenue (30gg)"
                    value={formatCurrency(kpiData.totalRevenue)}
                    icon={<DollarSign size={32} />}
                    subtitle="Entrate totali"
                    color="from-green-900/20 to-emerald-900/10"
                    borderColor="border-green-500/30"
                    iconColor="text-green-400"
                    trend={kpiData.totalRevenue > prevRevenue ? 'up' : 'down'}
                />
                <KPICard
                    title="Utenti Totali"
                    value={kpiData.totalUsers.toLocaleString()}
                    icon={<Users size={32} />}
                    subtitle={`+${kpiData.newUsers7d} ultimi 7gg`}
                    color="from-blue-900/20 to-indigo-900/10"
                    borderColor="border-blue-500/30"
                    iconColor="text-blue-400"
                />
                <KPICard
                    title="Utenti Paganti"
                    value={kpiData.payingUsers.toLocaleString()}
                    icon={<ShoppingCart size={32} />}
                    subtitle={`${conversionRate.toFixed(1)}% conversion`}
                    color="from-purple-900/20 to-pink-900/10"
                    borderColor="border-purple-500/30"
                    iconColor="text-purple-400"
                />
                <KPICard
                    title="AOV"
                    value={formatCurrency(avgOrderValue)}
                    icon={<TrendingUp size={32} />}
                    subtitle="Avg Order Value"
                    color="from-amber-900/20 to-orange-900/10"
                    borderColor="border-amber-500/30"
                    iconColor="text-amber-400"
                />
            </motion.div>

            {/* Revenue Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 mb-10 hover:border-amber-500/30 transition-all duration-300"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Andamento Revenue</h2>
                        <p className="text-sm text-gray-400">Vendite ultimi 30 giorni</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <Activity className="text-green-400" size={20} />
                        <span className="text-green-400 font-semibold">Live Data</span>
                    </div>
                </div>

                {kpiData.revenueData.length > 0 ? (
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={kpiData.revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#9ca3af"
                                    style={{ fontSize: '10px' }}
                                    tick={{ fontSize: 10 }}
                                />
                                <YAxis
                                    stroke="#9ca3af"
                                    style={{ fontSize: '10px' }}
                                    tickFormatter={(value) => `€${value}`}
                                    tick={{ fontSize: 10 }}
                                    width={40}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: '1px solid #374151',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        fontSize: '12px'
                                    }}
                                    formatter={(value: any) => [`€${value}`, 'Revenue']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-500">
                        <p>Nessun dato disponibile per il chart</p>
                    </div>
                )}
            </motion.div>

            {/* Recent Activity Feed */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Acquisti Recenti</h2>
                        <p className="text-sm text-gray-400">Ultimi 10 ordini</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <Zap className="text-purple-400" size={16} />
                        <span className="text-purple-400 font-semibold text-sm">LIVE FEED</span>
                    </div>
                </div>

                <div className="space-y-3">
                    {kpiData.recentPurchases.length === 0 ? (
                        <div className="text-center py-16">
                            <ShoppingCart className="mx-auto mb-4 text-gray-600" size={64} />
                            <p className="text-xl text-gray-400">Nessun acquisto recente</p>
                            <p className="text-sm text-gray-500 mt-2">Gli ordini appariranno qui in tempo reale</p>
                        </div>
                    ) : (
                        kpiData.recentPurchases.map((purchase, index) => (
                            <motion.div
                                key={purchase.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 px-4 border border-white/5 rounded-xl hover:bg-white/5 hover:border-purple-500/30 transition-all duration-300 group gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-700/20 flex items-center justify-center border border-green-500/40 group-hover:scale-110 transition-transform">
                                        <DollarSign size={20} className="text-green-400" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">
                                            {purchase.profiles?.full_name || purchase.email}
                                        </div>
                                        <div className="text-sm text-gray-400 flex items-center gap-2">
                                            {getCourseName(purchase.course_id)}
                                            <span className="text-gray-600">•</span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {new Date(purchase.purchase_timestamp).toLocaleDateString('it-IT', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-left md:text-right w-full md:w-auto mt-2 md:mt-0 pl-[64px] md:pl-0">
                                    <div className="font-bold text-2xl text-green-400">
                                        {formatCurrency(purchase.amount / 100)}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {purchase.payment_provider || 'Stripe'}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const KPICard = ({
    title,
    value,
    icon,
    subtitle,
    color,
    borderColor,
    iconColor,
    trend
}: {
    title: string;
    value: string;
    icon: React.ReactNode;
    subtitle?: string;
    color: string;
    borderColor: string;
    iconColor: string;
    trend?: 'up' | 'down';
}) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className={`backdrop-blur-sm bg-gradient-to-br ${color} border ${borderColor} rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 group`}
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 ${iconColor.replace('text-', 'bg-')}/20 rounded-xl group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            {trend && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    <span className="text-xs font-bold">{trend === 'up' ? '+' : '-'}%</span>
                </div>
            )}
        </div>
        <p className="text-gray-400 text-sm font-semibold mb-1">{title}</p>
        <h3 className={`text-4xl font-black ${iconColor} mb-2 tracking-tight`}>{value}</h3>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </motion.div>
);
