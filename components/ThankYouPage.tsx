import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BRANDING } from '../config/branding';
import { supabase } from '../services/supabase';

interface TierConfig {
    name: string;
    message: string;
    bonus: string;
    icon: string;
}

const TIER_CONFIGS: Record<string, TierConfig> = {
    'matrice-1': {
        name: 'MATRICE I: Storytelling Strategy Master',
        message: '🎯 Hai sbloccato il potere dello storytelling strategico!',
        bonus: '20 Template Storytelling Esclusivi',
        icon: '📚'
    },
    'matrice-2': {
        name: 'MATRICE II: AI Podcast Mastery',
        message: '🎙️ Benvenuto nel mondo del podcasting professionale!',
        bonus: '10 Script AI Podcast Ottimizzati',
        icon: '🎧'
    },
    'ascension-box': {
        name: 'ASCENSION BOX: Elite Mastermind',
        message: '👑 Benvenuto nell\'élite! Accesso completo sbloccato.',
        bonus: 'Sessione 1-on-1 VIP + Tutti i Bonus',
        icon: '💎'
    }
};

export const ThankYouPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);
    const [bonusTimeLeft, setBonusTimeLeft] = useState<string>('');
    const [purchaseData, setPurchaseData] = useState<any>(null);

    const sessionId = searchParams.get('session_id');
    const email = searchParams.get('email');
    const courseId = searchParams.get('course') || 'matrice-1';

    const tierConfig = TIER_CONFIGS[courseId] || TIER_CONFIGS['matrice-1'];

    useEffect(() => {
        // Fetch purchase data to get bonus expiry
        const fetchPurchaseData = async () => {
            if (!sessionId) return;

            try {
                const { data } = await supabase
                    .from('purchases')
                    .select('*')
                    .eq('stripe_payment_id', sessionId)
                    .single();

                if (data) {
                    setPurchaseData(data);
                }
            } catch (error) {
                console.error('Error fetching purchase data:', error);
            }
        };

        fetchPurchaseData();
    }, [sessionId]);

    useEffect(() => {
        // Calculate bonus time remaining
        if (purchaseData?.bonus_expires_at) {
            const updateTimer = () => {
                const now = new Date().getTime();
                const expiry = new Date(purchaseData.bonus_expires_at).getTime();
                const diff = expiry - now;

                if (diff <= 0) {
                    setBonusTimeLeft('SCADUTO');
                } else {
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                    setBonusTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
                }
            };

            updateTimer();
            const interval = setInterval(updateTimer, 1000);
            return () => clearInterval(interval);
        }
    }, [purchaseData]);

    useEffect(() => {
        // Countdown redirect
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            navigate(`/signup${email ? `?email=${email}` : ''}`);
        }
    }, [countdown, navigate, email]);

    return (
        <div className="min-h-screen bg-[#00040A] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-yellow-500/30">
            {/* 🌌 Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            </div>

            {/* ✨ Content Container */}
            <div className="relative z-10 w-full max-w-2xl animate-fade-in-up">

                {/* Brand Header */}
                <div className="text-center mb-12">
                    <h1 className="font-serif text-2xl tracking-[0.3em] text-yellow-500/80 mb-2 uppercase">
                        {BRANDING.shortName}
                    </h1>
                    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent mx-auto"></div>
                </div>

                {/* Main Card */}
                <div className="backdrop-blur-2xl bg-[#0A0A0A]/60 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative group overflow-hidden">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                    {/* Success Icon */}
                    <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                        <div className="relative w-full h-full bg-gradient-to-br from-green-900 to-black border border-green-500/30 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="text-center mb-10 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-tight">
                            ACCESSO
                            <span className="block text-green-400 drop-shadow-lg mt-2 font-serif italic">CONFERMATO</span>
                        </h2>
                        <p className="text-xl text-gray-300 font-light border-l-2 border-yellow-500/50 pl-4 inline-block mx-auto text-left">
                            {tierConfig.message}
                        </p>
                    </div>

                    {/* Course Badge */}
                    <div className="mb-10 p-[1px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent rounded-xl">
                        <div className="bg-[#050505] rounded-xl p-6 flex items-center gap-6 relative overflow-hidden">
                            <span className="text-4xl filter drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">{tierConfig.icon}</span>
                            <div className="text-left">
                                <div className="text-xs text-yellow-500 uppercase tracking-widest mb-1">Livello Sbloccato</div>
                                <div className="font-bold text-lg text-white">{tierConfig.name}</div>
                            </div>
                        </div>
                    </div>

                    {/* Bonus Section (if eligible) */}
                    {purchaseData?.bonus_eligible && (
                        <div className="mb-10 text-center relative">
                            <div className="inline-block relative">
                                <span className="absolute -top-3 -right-3 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                                </span>
                                <div className="border border-yellow-500/30 bg-yellow-900/10 px-6 py-3 rounded-full text-yellow-400 text-sm font-semibold tracking-wide">
                                    🎁 BONUS DISPONIBILE PER {bonusTimeLeft || '24h'}
                                </div>
                            </div>
                            <p className="mt-4 text-gray-400 text-sm max-w-sm mx-auto">
                                Completa la registrazione ora per riscattare: <br />
                                <strong className="text-white">{tierConfig.bonus}</strong>
                            </p>
                        </div>
                    )}

                    {/* Automatic Redirect Countdown */}
                    <div className="mb-8 flex flex-col items-center">
                        <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Inizializzazione Account</div>
                        <div className="flex gap-2">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1 w-8 rounded-full transition-colors duration-500 ${i < countdown ? 'bg-yellow-500' : 'bg-gray-800'}`}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={() => navigate(`/signup${email ? `?email=${email}` : ''}`)}
                        className="w-full group relative px-8 py-5 bg-white text-black font-bold text-lg tracking-widest uppercase overflow-hidden rounded-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            Entra Nella Matrice
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                        <div className="absolute inset-0 bg-yellow-400 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0"></div>
                    </button>

                    {/* Session Info */}
                    {sessionId && (
                        <div className="mt-6 pt-6 border-t border-white/5 flex justify-between text-[10px] text-gray-600 font-mono">
                            <span>SECURE_ID: {sessionId.substring(0, 8)}...</span>
                            <span>ENCRYPTED_CONNECTION</span>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center text-xs text-gray-600 tracking-widest uppercase">
                    Vox Lux Strategy • Protocollo Sovrano
                </div>
            </div>

            <style>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.3; transform: scale(1.1); }
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-pulse-slow { animation: pulse-slow 8s infinite ease-in-out; }
                .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }
            `}</style>
        </div>
    );
};
