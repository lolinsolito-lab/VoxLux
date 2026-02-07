import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

interface BonusProduct {
    id: string;
    title: string;
    description: string;
    icon: string;
    delivery_type: 'video' | 'download' | 'link';
    content_url: string;
}

import { createCheckoutSession, STRIPE_PRODUCTS, CourseId } from '../services/stripe';
import { Lock, ShoppingCart, CheckCircle, Crown, X, Settings, Shield } from 'lucide-react';
import { ProfileSettings } from './ProfileSettings';

// Secret admin email - only this email can see GOD MODE button
const ADMIN_EMAIL = 'jaramichael@hotmail.com';

export const DashboardPage: React.FC = () => {
    const { user, logout, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [progress, setProgress] = useState<Record<string, CourseProgress>>({});
    const [bonuses, setBonuses] = useState<BonusProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    // Modal State
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [purchasedCourseName, setPurchasedCourseName] = useState('');
    const [showProfileSettings, setShowProfileSettings] = useState(false);

    useEffect(() => {
        if (user) {
            loadUserData();

            // Check for success params from internal upsell return
            const success = searchParams.get('success');
            const courseId = searchParams.get('course');

            if (success === 'true' && courseId) {
                // Determine course name
                const courseName = STRIPE_PRODUCTS[courseId as CourseId]?.name || 'Nuovo Corso';
                setPurchasedCourseName(courseName);
                setShowSuccessModal(true);

                // Trigger immediate sync to unlock content
                handleSyncPurchases(true).then(() => {
                    // Clean URL without reload
                    setSearchParams({});
                });
            } else {
                // Auto-sync on load just in case (fallback)
                handleSyncPurchases(false);
            }
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
            await Promise.all([
                loadUserData(),
                refreshUser()
            ]);

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
                .select('id, course_id, purchase_timestamp')
                .eq('user_id', user.id)
                .eq('status', 'active');

            // Dedup purchases
            const uniquePurchases = Array.from(new Map((purchasesData || []).map(p => [p.course_id, p])).values());
            setPurchases(uniquePurchases);

            // Fetch progress
            const progressData: Record<string, CourseProgress> = {};
            for (const purchase of uniquePurchases) {
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

    const handleBuyCourse = async (courseId: string) => {
        if (!user?.email) return;
        try {
            // Internal upsell: Redirect back to dashboard on success
            const returnUrl = `${window.location.origin}/dashboard`;
            await createCheckoutSession(courseId as CourseId, user.email, undefined, returnUrl);
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Errore durante l\'avvio del checkout. Riprova.');
        }
    };

    // Fixed Course Definition
    const ALL_COURSES = [
        {
            id: 'matrice-1',
            title: 'Storytelling Strategy Master',
            icon: '✨',
            route: '/course/matrice-1',
            priceId: STRIPE_PRODUCTS['matrice-1'].priceId,
            price: STRIPE_PRODUCTS['matrice-1'].amount,
            description: STRIPE_PRODUCTS['matrice-1'].description
        },
        {
            id: 'matrice-2',
            title: 'Vox Podcast Master',
            icon: '🎙️',
            route: '/course/matrice-2',
            priceId: STRIPE_PRODUCTS['matrice-2'].priceId,
            price: STRIPE_PRODUCTS['matrice-2'].amount,
            description: STRIPE_PRODUCTS['matrice-2'].description
        }
    ];

    // Calculate Owned Course IDs
    const ownedCourseIds = new Set(purchases.map(p => p.course_id));
    const hasAscension = ownedCourseIds.has('ascension-box');

    // Helper to check if a course is unlocked
    const isUnlocked = (courseId: string) => ownedCourseIds.has(courseId) || hasAscension;

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

                    <div className="flex items-center gap-4">
                        {hasAscension && (
                            <div className="relative group">
                                <div className="px-3 py-1 bg-gradient-to-r from-purple-900/50 to-black border border-purple-500/50 rounded-full text-purple-300 text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-pulse hover:animate-none cursor-help">
                                    <Crown size={14} className="text-yellow-400 fill-yellow-400" />
                                    <span>DOMINUS ELITE</span>
                                </div>
                                {/* Tooltip */}
                                <div className="absolute top-full mt-2 right-0 w-64 p-3 bg-black/90 border border-purple-500/30 rounded-lg text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                    Status "Ascension" attivo. Accesso illimitato a tutti i protocolli Vox Lux.
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setShowProfileSettings(true)}
                            className="p-2 text-gray-400 hover:text-yellow-500 transition-colors border border-white/10 rounded-lg hover:border-yellow-500/50"
                            title="Impostazioni Profilo"
                        >
                            <Settings size={18} />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors border border-white/10 rounded-lg hover:border-yellow-500/50"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Welcome Section */}
                <div className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 relative overflow-hidden ${hasAscension ? 'border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]' : ''}`}>
                    {hasAscension && (
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-600/20 blur-3xl rounded-full pointer-events-none"></div>
                    )}

                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        Benvenuto, {user?.name || user?.email}
                        {hasAscension ? '👑' : '👋'}

                        {/* Secret GOD MODE button - only for admin */}
                        {user?.email === ADMIN_EMAIL && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="ml-4 px-3 py-1 text-xs bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white font-bold rounded-lg flex items-center gap-1.5 transition-all transform hover:scale-105 shadow-lg shadow-red-900/30"
                            >
                                <Shield size={12} />
                                GOD MODE
                            </button>
                        )}
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
                        <span>🌟</span> I Tuoi Corsi & Potenziamenti
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ALL_COURSES.map((course) => {
                            const unlocked = isUnlocked(course.id);
                            const prog = progress[course.id] || { completed_masterminds: 0, total_masterminds: 10 };
                            const progressPercent = (prog.completed_masterminds / prog.total_masterminds) * 100;

                            if (unlocked) {
                                // ACTIVE CARD RENDER
                                return (
                                    <div
                                        key={course.id}
                                        className="h-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-yellow-500/50 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col"
                                        onClick={() => navigate(course.route)}
                                    >
                                        <div className="absolute top-0 right-0 bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-1 rounded-bl-lg border-l border-b border-green-500/30">ATTIVO</div>

                                        <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-500">{course.icon}</div>

                                        <h4 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-500 transition-colors uppercase tracking-wide leading-tight">
                                            {course.title}
                                        </h4>

                                        {/* Progress Line */}
                                        <div className="w-full bg-gray-800 h-1.5 rounded-full mb-4 overflow-hidden">
                                            <div
                                                className="bg-yellow-500 h-full rounded-full transition-all duration-1000"
                                                style={{ width: `${progressPercent}%` }}
                                            ></div>
                                        </div>

                                        <div className="space-y-2 mb-6 flex-grow">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Progresso</span>
                                                <span className="text-yellow-500 font-semibold">{Math.round(progressPercent)}%</span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {prog.completed_masterminds}/{prog.total_masterminds} Mondi completati
                                            </div>
                                        </div>

                                        <button className="w-full py-3 bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-black font-bold rounded-lg shadow-lg shadow-yellow-500/30 transition-all duration-300 transform group-hover:scale-[1.02]">
                                            {prog.completed_masterminds === 0 ? '🚀 INIZIA' : '🔥 CONTINUA'}
                                        </button>
                                    </div>
                                );
                            } else {
                                // LOCKED CARD RENDER (Upsell)
                                return (
                                    <div
                                        key={course.id}
                                        className="h-full backdrop-blur-sm bg-black/40 border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group flex flex-col relative"
                                    >
                                        <div className="absolute top-4 right-4 text-gray-600 group-hover:text-white transition-colors">
                                            <Lock size={20} />
                                        </div>

                                        <div className="text-5xl mb-4 opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                                            {course.icon}
                                        </div>

                                        <h4 className="text-xl font-bold text-gray-400 mb-2 group-hover:text-white transition-colors uppercase tracking-wide leading-tight">
                                            {course.title}
                                        </h4>

                                        <p className="text-sm text-gray-500 mb-6 flex-grow italic">
                                            {course.description || ''}
                                        </p>

                                        <div className="mt-auto">
                                            <div className="flex items-end gap-2 mb-4">
                                                <span className="text-2xl font-bold text-white">€{((course.price || 0) / 100).toFixed(0)}</span>
                                                <span className="text-xs text-gray-500 mb-1 line-through">€997</span>
                                            </div>

                                            <button
                                                onClick={() => handleBuyCourse(course.id)}
                                                className="w-full py-3 border border-white/20 text-gray-300 hover:text-black hover:bg-white hover:border-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                            >
                                                <ShoppingCart size={16} /> SBLOCCA ORA
                                            </button>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>
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

            {/* Smart Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-yellow-500/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.2)] max-w-md w-full relative text-center">
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={32} className="text-yellow-500" />
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2">Complimenti, {user?.name?.split(' ')[0] || 'Guerriero'}!</h3>
                        <p className="text-gray-400 mb-6">
                            Hai sbloccato con successo <span className="text-yellow-500 font-semibold">{purchasedCourseName}</span>.
                            <br />Il tuo equipaggiamento è stato aggiornato.
                        </p>

                        {hasAscension && (
                            <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg mb-6 flex items-center gap-3 text-left">
                                <Crown className="text-purple-400 shrink-0" size={24} />
                                <div>
                                    <p className="text-purple-300 font-bold text-sm">Status DOMINUS Attivo</p>
                                    <p className="text-gray-400 text-xs">Massimo potere sbloccato.</p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full py-3 bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-black font-bold rounded-lg shadow-lg shadow-yellow-500/30 transition-all duration-300 transform hover:scale-[1.02]"
                        >
                            INIZIA ORA
                        </button>
                    </div>
                </div>
            )}

            {/* Profile Settings Modal */}
            <ProfileSettings
                isOpen={showProfileSettings}
                onClose={() => setShowProfileSettings(false)}
            />
        </div>
    );
};
