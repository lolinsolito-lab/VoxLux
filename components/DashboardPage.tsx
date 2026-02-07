import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { BRANDING } from '../config/branding';

interface Purchase {
    course_id: string;
    purchase_timestamp: string;
}

interface CourseProgress {
    completed_masterminds: number;
    total_masterminds: number;
}

export const DashboardPage: React.FC = () => {
    const { user, logout, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [progress, setProgress] = useState<Record<string, CourseProgress>>({});
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        if (user) {
            loadUserData();
            // Auto-sync on load just in case
            handleSyncPurchases(false);
        }
    }, [user]);

    const handleSyncPurchases = async (manual = true) => {
        if (!user?.email) return;
        if (manual) setSyncing(true);

        try {
            // Call local Vercel API
            await fetch('/api/activate-purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    userId: user.id
                })
            });

            // Reload data after sync attempt
            if (manual) {
                await Promise.all([
                    loadUserData(),
                    refreshUser()
                ]);
            }
        } catch (error) {
            console.error('Error syncing purchases:', error);
        } finally {
            if (manual) setSyncing(false);
        }
    };

    const loadUserData = async () => {
        if (!user) return;

        try {
            // Fetch user purchases
            const { data: purchasesData } = await supabase
                .from('purchases')
                .select('course_id, purchase_timestamp')
                .eq('user_id', user.id)
                .eq('status', 'active');

            setPurchases(purchasesData || []);

            // Dedup purchases by course_id to prevent double cards
            const uniquePurchases = Array.from(new Map((purchasesData || []).map(p => [p.course_id, p])).values());
            setPurchases(uniquePurchases);

            // Fetch progress for each course
            const progressData: Record<string, CourseProgress> = {};
            for (const purchase of purchasesData || []) {
                const { data } = await supabase
                    .from('course_progress')
                    .select('mastermind_id')
                    .eq('user_id', user.id)
                    .eq('course_id', purchase.course_id)
                    .eq('completed', true);

                const uniqueMasterminds = new Set(data?.map(d => d.mastermind_id) || []);
                progressData[purchase.course_id] = {
                    completed_masterminds: uniqueMasterminds.size,
                    total_masterminds: 10
                };
            }
            setProgress(progressData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getCourseInfo = (courseId: string) => {
        const courseMap: Record<string, { name: string; icon: string; route: string }> = {
            'matrice-1': {
                name: 'MATRICE I',
                icon: '✨',
                route: '/course/matrice-1'
            },
            'matrice-2': {
                name: 'MATRICE II',
                icon: '🎙️',
                route: '/course/matrice-2'
            },
            'ascension-box': {
                name: 'ASCENSION BOX',
                icon: '🔮',
                route: '/ascension'
            }
        };
        return courseMap[courseId] || { name: courseId, icon: '📚', route: '/' };
    };

    const getProgressDots = (courseId: string) => {
        const prog = progress[courseId] || { completed_masterminds: 0, total_masterminds: 10 };
        return Array.from({ length: prog.total_masterminds }, (_, i) => i < prog.completed_masterminds);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 text-sm">Caricamento dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 bg-clip-text text-transparent mb-2">
                            {BRANDING.shortName}
                        </h1>
                        <p className="text-gray-400 text-sm">Dashboard Personale</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors border border-white/10 rounded-lg hover:border-yellow-500/50"
                    >
                        Logout
                    </button>
                </div>

                {/* Welcome Section */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Benvenuto, {user?.name || user?.email} 👋
                    </h2>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">Livello: <span className="text-yellow-500 font-semibold">{user?.level}</span></span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">XP: <span className="text-cyan-400 font-semibold">{user?.xp}</span></span>
                    </div>
                </div>

                {/* Courses Section */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <span>🌟</span> I Tuoi Corsi
                    </h3>

                    {purchases.length === 0 ? (
                        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                            <div className="text-6xl mb-4">📚</div>
                            <h4 className="text-xl font-bold text-white mb-2">Nessun Corso Ancora</h4>
                            <p className="text-gray-400 mb-6">Acquista un corso per iniziare la tua ascensione</p>

                            <div className="flex flex-col gap-4 items-center">
                                <button
                                    onClick={() => navigate('/pricing')}
                                    className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-black font-bold rounded-lg shadow-lg shadow-yellow-500/30 transition-all duration-300 transform hover:scale-105"
                                >
                                    Esplora Corsi
                                </button>

                                <button
                                    onClick={() => handleSyncPurchases(true)}
                                    disabled={syncing}
                                    className="text-sm text-yellow-500 hover:text-yellow-400 underline decoration-dotted underline-offset-4 disabled:opacity-50"
                                >
                                    {syncing ? 'Sincronizzazione in corso...' : 'Non vedi il tuo corso? Sincronizza acquisti'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {purchases.map((purchase) => {
                                const courseInfo = getCourseInfo(purchase.course_id);
                                const prog = progress[purchase.course_id] || { completed_masterminds: 0, total_masterminds: 10 };
                                const progressPercent = (prog.completed_masterminds / prog.total_masterminds) * 100;

                                return (
                                    <div
                                        key={purchase.course_id}
                                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-yellow-500/50 transition-all duration-300 group cursor-pointer"
                                        onClick={() => navigate(courseInfo.route)}
                                    >
                                        {/* Course Icon */}
                                        <div className="text-5xl mb-4">{courseInfo.icon}</div>

                                        {/* Course Name */}
                                        <h4 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-500 transition-colors">
                                            {courseInfo.name}
                                        </h4>

                                        {/* Progress Dots */}
                                        <div className="flex gap-1 mb-4">
                                            {getProgressDots(purchase.course_id).map((completed, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`w-3 h-3 rounded-full ${completed ? 'bg-yellow-500' : 'bg-gray-700'
                                                        }`}
                                                />
                                            ))}
                                        </div>

                                        {/* Progress Info */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Progresso</span>
                                                <span className="text-yellow-500 font-semibold">{Math.round(progressPercent)}%</span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {prog.completed_masterminds}/{prog.total_masterminds} Mondi completati
                                            </div>
                                        </div>

                                        {/* CTA Button */}
                                        <button className="w-full py-3 bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-black font-bold rounded-lg shadow-lg shadow-yellow-500/30 transition-all duration-300 transform group-hover:scale-105">
                                            {prog.completed_masterminds === 0 ? '🚀 INIZIA' : '🔥 CONTINUA'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Quick Stats (if has courses) */}
                {purchases.length > 0 && (
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">📊 Statistiche Rapide</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-500">{purchases.length}</div>
                                <div className="text-xs text-gray-400">Corsi Attivi</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-cyan-500">{user?.xp}</div>
                                <div className="text-xs text-gray-400">XP Totale</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-500">
                                    {Object.values(progress).reduce((acc, p) => acc + p.completed_masterminds, 0)}
                                </div>
                                <div className="text-xs text-gray-400">Mondi Completati</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-500">{user?.level}</div>
                                <div className="text-xs text-gray-400">Livello</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
