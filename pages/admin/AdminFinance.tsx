import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, RefreshCw } from 'lucide-react';
import { supabase } from '../../services/supabase';

interface RevenueDay {
    date: string;
    course_id: string;
    purchases: number;
    revenue_eur: number;
}

interface FinanceStats {
    totalRevenue: number;
    thisMonthRevenue: number;
    lastMonthRevenue: number;
    averageOrderValue: number;
    totalPurchases: number;
    revenueByDay: RevenueDay[];
    revenueByCourse: { course_id: string; total: number; count: number }[];
}

export const AdminFinance: React.FC = () => {
    const [stats, setStats] = useState<FinanceStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

    useEffect(() => {
        fetchFinanceData();
    }, [timeRange]);

    const fetchFinanceData = async () => {
        try {
            setLoading(true);

            // Calculate date range
            const now = new Date();
            const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
            const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

            // Fetch revenue data from view
            const { data: revenueData, error } = await supabase
                .from('admin_revenue_overview')
                .select('*')
                .gte('date', startDate.toISOString())
                .order('date', { ascending: true });

            if (error) throw error;

            // Fetch all-time purchases for course breakdown
            const { data: allPurchases } = await supabase
                .from('purchases')
                .select('course_id, amount')
                .eq('status', 'active');

            // Calculate stats
            const totalRevenue = revenueData?.reduce((sum, day) => sum + (day.revenue_eur || 0), 0) || 0;
            const totalPurchases = revenueData?.reduce((sum, day) => sum + (day.purchases || 0), 0) || 0;

            // Group by course
            const courseMap = new Map<string, { total: number; count: number }>();
            allPurchases?.forEach(p => {
                const existing = courseMap.get(p.course_id) || { total: 0, count: 0 };
                courseMap.set(p.course_id, {
                    total: existing.total + (p.amount / 100),
                    count: existing.count + 1
                });
            });

            // Calculate month comparisons
            const thisMonth = new Date().getMonth();
            const thisMonthData = revenueData?.filter(d => new Date(d.date).getMonth() === thisMonth) || [];
            const lastMonthData = revenueData?.filter(d => new Date(d.date).getMonth() === thisMonth - 1) || [];

            setStats({
                totalRevenue,
                thisMonthRevenue: thisMonthData.reduce((sum, d) => sum + (d.revenue_eur || 0), 0),
                lastMonthRevenue: lastMonthData.reduce((sum, d) => sum + (d.revenue_eur || 0), 0),
                averageOrderValue: totalPurchases > 0 ? totalRevenue / totalPurchases : 0,
                totalPurchases,
                revenueByDay: revenueData || [],
                revenueByCourse: Array.from(courseMap.entries()).map(([course_id, data]) => ({
                    course_id,
                    ...data
                }))
            });
        } catch (error) {
            console.error('Error fetching finance data:', error);
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

    const getCourseColor = (courseId: string) => {
        const colors: Record<string, string> = {
            'matrice-1': 'from-blue-500 to-blue-700',
            'matrice-2': 'from-purple-500 to-purple-700',
            'ascension-box': 'from-yellow-500 to-yellow-700'
        };
        return colors[courseId] || 'from-zinc-500 to-zinc-700';
    };

    // Calculate max revenue for chart scaling
    const maxRevenue = stats?.revenueByDay.reduce((max, d) => Math.max(max, d.revenue_eur || 0), 0) || 1;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    const monthChange = stats && stats.lastMonthRevenue > 0
        ? ((stats.thisMonthRevenue - stats.lastMonthRevenue) / stats.lastMonthRevenue * 100)
        : 0;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black tracking-tighter text-white">
                    FINANZE <span className="text-yellow-500">& REVENUE</span>
                </h1>
                <div className="flex items-center space-x-2">
                    <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                        {(['7d', '30d', '90d'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${timeRange === range
                                    ? 'bg-yellow-500 text-black'
                                    : 'text-zinc-500 hover:text-white'
                                    }`}
                            >
                                {range.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={fetchFinanceData}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg transition-colors"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-700/5 border border-yellow-500/30 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign className="text-yellow-500" size={24} />
                        <span className={`text-xs font-bold px-2 py-1 rounded ${monthChange >= 0 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                            {monthChange >= 0 ? '+' : ''}{monthChange.toFixed(1)}%
                        </span>
                    </div>
                    <p className="text-zinc-400 text-sm">Revenue Periodo</p>
                    <h3 className="text-3xl font-black text-yellow-400">{formatCurrency(stats?.totalRevenue || 0)}</h3>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
                    <Calendar className="text-blue-500 mb-2" size={24} />
                    <p className="text-zinc-400 text-sm">Questo Mese</p>
                    <h3 className="text-2xl font-bold text-white">{formatCurrency(stats?.thisMonthRevenue || 0)}</h3>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
                    <TrendingUp className="text-green-500 mb-2" size={24} />
                    <p className="text-zinc-400 text-sm">AOV (Medio)</p>
                    <h3 className="text-2xl font-bold text-white">{formatCurrency(stats?.averageOrderValue || 0)}</h3>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
                    <DollarSign className="text-purple-500 mb-2" size={24} />
                    <p className="text-zinc-400 text-sm">Transazioni</p>
                    <h3 className="text-2xl font-bold text-white">{stats?.totalPurchases || 0}</h3>
                </div>
            </div>

            {/* REVENUE CHART (CSS-based) */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-300 mb-6">Andamento Revenue</h2>
                <div className="h-48 flex items-end space-x-1">
                    {stats?.revenueByDay.slice(-30).map((day, index) => {
                        const height = maxRevenue > 0 ? (day.revenue_eur / maxRevenue) * 100 : 0;
                        return (
                            <div
                                key={index}
                                className="flex-1 group relative"
                            >
                                <div
                                    className="bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-sm hover:from-yellow-500 hover:to-yellow-300 transition-all cursor-pointer"
                                    style={{ height: `${Math.max(height, 2)}%` }}
                                />
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black border border-zinc-700 rounded px-2 py-1 text-xs text-white whitespace-nowrap z-10">
                                    {new Date(day.date).toLocaleDateString('it-IT')}<br />
                                    {formatCurrency(day.revenue_eur)}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-between mt-2 text-xs text-zinc-600">
                    <span>{stats?.revenueByDay[0] ? new Date(stats.revenueByDay[0].date).toLocaleDateString('it-IT') : '-'}</span>
                    <span>{stats?.revenueByDay[stats.revenueByDay.length - 1] ? new Date(stats.revenueByDay[stats.revenueByDay.length - 1].date).toLocaleDateString('it-IT') : '-'}</span>
                </div>
            </div>

            {/* REVENUE BY COURSE */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-300 mb-6">Revenue per Corso</h2>
                <div className="space-y-4">
                    {stats?.revenueByCourse.map((course) => {
                        const totalCourseRev = stats.revenueByCourse.reduce((sum, c) => sum + c.total, 0);
                        const percentage = totalCourseRev > 0 ? (course.total / totalCourseRev) * 100 : 0;
                        return (
                            <div key={course.course_id} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-zinc-200">{getCourseName(course.course_id)}</span>
                                    <div className="text-right">
                                        <span className="font-bold text-white">{formatCurrency(course.total)}</span>
                                        <span className="text-xs text-zinc-500 ml-2">({course.count} vendite)</span>
                                    </div>
                                </div>
                                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${getCourseColor(course.course_id)} rounded-full transition-all duration-500`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* FIXED COSTS SECTION */}
            <div className="bg-zinc-900/50 border border-red-900/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-300">Costi Fissi Mensili</h2>
                    <span className="text-xs text-zinc-500">Aggiornamento manuale</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {/* Supabase */}
                    <div className="bg-black/40 border border-zinc-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-emerald-400">Supabase</span>
                            <span className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded">Database</span>
                        </div>
                        <p className="text-2xl font-black text-white">€25<span className="text-xs text-zinc-500">/mese</span></p>
                        <p className="text-xs text-zinc-600 mt-1">Pro Plan - 8GB Storage</p>
                    </div>

                    {/* Stripe */}
                    <div className="bg-black/40 border border-zinc-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-purple-400">Stripe</span>
                            <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded">Payments</span>
                        </div>
                        <p className="text-2xl font-black text-white">1.4%<span className="text-xs text-zinc-500">+€0.25</span></p>
                        <p className="text-xs text-zinc-600 mt-1">Per transazione EU</p>
                    </div>

                    {/* Resend */}
                    <div className="bg-black/40 border border-zinc-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-blue-400">Resend</span>
                            <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded">Email</span>
                        </div>
                        <p className="text-2xl font-black text-white">€0<span className="text-xs text-zinc-500">/mese</span></p>
                        <p className="text-xs text-zinc-600 mt-1">Free tier - 3k emails/mese</p>
                    </div>

                    {/* Hostinger */}
                    <div className="bg-black/40 border border-zinc-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-orange-400">Hostinger</span>
                            <span className="text-xs bg-orange-900/30 text-orange-400 px-2 py-0.5 rounded">Dominio</span>
                        </div>
                        <p className="text-2xl font-black text-white">€15<span className="text-xs text-zinc-500">/anno</span></p>
                        <p className="text-xs text-zinc-600 mt-1">voxlux.com + voxluxstrategy.com</p>
                    </div>

                    {/* Vercel */}
                    <div className="bg-black/40 border border-zinc-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-white">Vercel</span>
                            <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded">Hosting</span>
                        </div>
                        <p className="text-2xl font-black text-white">€0<span className="text-xs text-zinc-500">/mese</span></p>
                        <p className="text-xs text-zinc-600 mt-1">Hobby Plan - Unlimited</p>
                    </div>

                    {/* Vimeo/YouTube */}
                    <div className="bg-black/40 border border-zinc-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-red-400">Video Hosting</span>
                            <span className="text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded">Media</span>
                        </div>
                        <p className="text-2xl font-black text-white">€0<span className="text-xs text-zinc-500">/mese</span></p>
                        <p className="text-xs text-zinc-600 mt-1">YouTube Unlisted / Vimeo Free</p>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-gradient-to-r from-red-900/20 to-transparent border border-red-800/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-zinc-400">Costo Totale Mensile (fisso)</p>
                            <p className="text-3xl font-black text-red-400">~€26<span className="text-xs text-zinc-500">/mese</span></p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-zinc-400">Costo Annuale Stimato</p>
                            <p className="text-xl font-bold text-zinc-300">~€312<span className="text-xs text-zinc-500">/anno</span></p>
                        </div>
                    </div>
                    <p className="text-xs text-zinc-600 mt-3">
                        💡 Stripe costa ~€8.60 per ogni vendita da €597 (1.4% + €0.25)
                    </p>
                </div>
            </div>
        </div>
    );
};
