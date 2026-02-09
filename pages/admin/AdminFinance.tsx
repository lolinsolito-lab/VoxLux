import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Calendar, RefreshCw, Download, Users, ShoppingCart, CreditCard } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '../../services/supabase';

interface Purchase {
    id: string;
    user_id: string;
    course_id: string;
    amount: number;
    status: string;
    created_at: string;
    profiles?: { name?: string; email?: string };
}

interface ChartDataPoint {
    date: string;
    revenue: number;
    purchases: number;
}

export const AdminFinance: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [monthRevenue, setMonthRevenue] = useState(0);
    const [avgOrderValue, setAvgOrderValue] = useState(0);
    const [totalPurchases, setTotalPurchases] = useState(0);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [recentTransactions, setRecentTransactions] = useState<Purchase[]>([]);

    useEffect(() => {
        fetchFinanceData();
        setupRealtime();
    }, [timeRange]);

    const setupRealtime = () => {
        const channel = supabase
            .channel('finance-updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'purchases' }, () => {
                fetchFinanceData();
            })
            .subscribe();

        return () => { channel.unsubscribe(); };
    };

    const fetchFinanceData = async () => {
        try {
            setLoading(true);

            const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - daysAgo);

            // Fetch purchases with user profiles
            const { data: purchases } = await supabase
                .from('purchases')
                .select(`*, profiles(name, email)`)
                .eq('status', 'active')
                .gte('created_at', startDate.toISOString())
                .order('created_at', { ascending: false });

            if (!purchases) return;

            // Calculate metrics
            const revenue = purchases.reduce((sum, p) => sum + (p.amount / 100), 0);
            setTotalRevenue(revenue);
            setTotalPurchases(purchases.length);
            setAvgOrderValue(purchases.length > 0 ? revenue / purchases.length : 0);

            // Month revenue
            const thisMonth = new Date().getMonth();
            const monthPurchases = purchases.filter(p => new Date(p.created_at).getMonth() === thisMonth);
            setMonthRevenue(monthPurchases.reduce((sum, p) => sum + (p.amount / 100), 0));

            // Prepare chart data
            const dateMap = new Map<string, { revenue: number; purchases: number }>();
            purchases.forEach(p => {
                const date = new Date(p.created_at).toISOString().split('T')[0];
                const existing = dateMap.get(date) || { revenue: 0, purchases: 0 };
                dateMap.set(date, {
                    revenue: existing.revenue + (p.amount / 100),
                    purchases: existing.purchases + 1
                });
            });

            const chartDataArray: ChartDataPoint[] = [];
            for (let i = daysAgo - 1; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const data = dateMap.get(dateStr) || { revenue: 0, purchases: 0 };
                chartDataArray.push({ date: dateStr, ...data });
            }
            setChartData(chartDataArray);

            // Recent transactions
            setRecentTransactions(purchases.slice(0, 10));

        } catch (error) {
            console.error('Error fetching finance data:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = () => {
        const headers = ['Data', 'Revenue (€)', 'Transazioni'];
        const rows = chartData.map(d => [
            new Date(d.date).toLocaleDateString('it-IT'),
            d.revenue.toFixed(2),
            d.purchases
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `voxlux-revenue-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    const getCourseName = (courseId: string) => {
        const names: Record<string, string> = {
            'matrice-1': 'Matrice 1',
            'matrice-2': 'Matrice 2',
            'ascension-box': 'Ascension Box'
        };
        return names[courseId] || courseId;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full"
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
                className="flex items-center justify-between"
            >
                <h1 className="text-5xl font-black tracking-tighter">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-amber-500">
                        REVENUE TRACKING
                    </span>
                </h1>
                <div className="flex items-center gap-3">
                    {/* Time Range Selector */}
                    <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                        {(['7d', '30d', '90d'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${timeRange === range
                                        ? 'bg-amber-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {range.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Export CSV */}
                    <button
                        onClick={exportCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/30 text-green-400 rounded-xl hover:bg-green-600/30 transition-all duration-300"
                    >
                        <Download size={18} />
                        Export CSV
                    </button>

                    {/* Refresh */}
                    <button
                        onClick={fetchFinanceData}
                        className="p-2 bg-white/5 border border-white/10 text-gray-400 rounded-xl hover:bg-white/10 transition-all duration-300"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
            </motion.div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Revenue */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="backdrop-blur-sm bg-gradient-to-br from-green-500/10 to-green-700/5 border border-green-500/30 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 hover:scale-105"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-3 bg-green-500/20 rounded-xl backdrop-blur-sm">
                            <DollarSign size={24} className="text-green-400" />
                        </div>
                        <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded-md font-bold">
                            {timeRange}
                        </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">Revenue Totale</p>
                    <h3 className="text-3xl font-black text-green-400">{formatCurrency(totalRevenue)}</h3>
                </motion.div>

                {/* Month Revenue */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="backdrop-blur-sm bg-gradient-to-br from-blue-500/10 to-blue-700/5 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-3 bg-blue-500/20 rounded-xl backdrop-blur-sm">
                            <Calendar size={24} className="text-blue-400" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">Questo Mese</p>
                    <h3 className="text-3xl font-black text-blue-400">{formatCurrency(monthRevenue)}</h3>
                </motion.div>

                {/* AOV */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="backdrop-blur-sm bg-gradient-to-br from-purple-500/10 to-purple-700/5 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-3 bg-purple-500/20 rounded-xl backdrop-blur-sm">
                            <TrendingUp size={24} className="text-purple-400" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">AOV (Avg Order)</p>
                    <h3 className="text-3xl font-black text-purple-400">{formatCurrency(avgOrderValue)}</h3>
                </motion.div>

                {/* Total Purchases */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="backdrop-blur-sm bg-gradient-to-br from-amber-500/10 to-amber-700/5 border border-amber-500/30 rounded-2xl p-6 hover:border-amber-500/50 transition-all duration-300 hover:scale-105"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-3 bg-amber-500/20 rounded-xl backdrop-blur-sm">
                            <ShoppingCart size={24} className="text-amber-400" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">Transazioni</p>
                    <h3 className="text-3xl font-black text-amber-400">{totalPurchases}</h3>
                </motion.div>
            </div>

            {/* REVENUE CHART */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6"
            >
                <h2 className="text-2xl font-bold text-white mb-6">Andamento Revenue & Transazioni</h2>
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis
                            dataKey="date"
                            stroke="#6b7280"
                            tick={{ fill: '#9ca3af' }}
                            tickFormatter={(date) => new Date(date).toLocaleDateString('it-IT', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis yAxisId="left" stroke="#10b981" tick={{ fill: '#10b981' }} />
                        <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tick={{ fill: '#f59e0b' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                            labelStyle={{ color: '#fff' }}
                            formatter={(value: any, name: string) => {
                                if (name === 'revenue') return [formatCurrency(value), 'Revenue'];
                                return [value, 'Acquisti'];
                            }}
                        />
                        <Legend />
                        <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                        <Area yAxisId="right" type="monotone" dataKey="purchases" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorPurchases)" />
                    </AreaChart>
                </ResponsiveContainer>
            </motion.div>

            {/* RECENT TRANSACTIONS */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Transazioni Recenti</h2>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-600/20 border border-green-500/30 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-400 font-bold">LIVE</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {recentTransactions.map((tx, index) => (
                        <motion.div
                            key={tx.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-500/20 rounded-xl">
                                        <CreditCard size={20} className="text-green-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{tx.profiles?.name || tx.profiles?.email || 'Utente'}</h4>
                                        <p className="text-sm text-gray-400">{getCourseName(tx.course_id)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-green-400">{formatCurrency(tx.amount / 100)}</p>
                                    <p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleString('it-IT')}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {recentTransactions.length === 0 && (
                        <div className="text-center py-12">
                            <ShoppingCart className="mx-auto mb-4 text-gray-600" size={48} />
                            <p className="text-gray-400">Nessuna transazione nel periodo selezionato</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
