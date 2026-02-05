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
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Success Card */}
            <div className="relative z-10 w-full max-w-3xl">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 bg-clip-text text-transparent tracking-wider">
                        {BRANDING.shortName}
                    </h1>
                </div>

                {/* Main Success Card */}
                <div className="backdrop-blur-xl bg-white/5 border border-yellow-500/50 rounded-2xl p-12 shadow-2xl text-center">
                    {/* Success Icon */}
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-black text-white mb-4">
                        ✅ PAGAMENTO CONFERMATO!
                    </h2>

                    {/* Tier-Specific Message */}
                    <p className="text-xl text-gray-300 mb-2">
                        {tierConfig.icon} {tierConfig.message}
                    </p>

                    {/* Course Name */}
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-6 mb-6">
                        <p className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-amber-400 bg-clip-text text-transparent">
                            {tierConfig.name}
                        </p>
                    </div>

                    {/* Bonus Section */}
                    {purchaseData?.bonus_eligible && (
                        <div className="backdrop-blur-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/50 rounded-xl p-6 mb-6">
                            <h3 className="text-lg font-bold text-yellow-500 mb-2">
                                🎁 BONUS SBLOCCATO!
                            </h3>
                            <p className="text-white font-semibold mb-3">
                                {tierConfig.bonus}
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                                <span>⏰ Registrati entro:</span>
                                <span className="font-mono font-bold text-yellow-500">
                                    {bonusTimeLeft || '24h 00m 00s'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                Il bonus sarà automaticamente tuo se completi la registrazione entro 24 ore!
                            </p>
                        </div>
                    )}

                    {/* Email Confirmation */}
                    {email && (
                        <p className="text-sm text-gray-400 mb-6">
                            📧 Email di conferma inviata a: <span className="text-yellow-500 font-semibold">{email}</span>
                        </p>
                    )}

                    {/* Countdown */}
                    <div className="mb-8">
                        <p className="text-gray-400 text-sm mb-2">
                            Creazione account automatica tra:
                        </p>
                        <div className="text-5xl font-black bg-gradient-to-r from-yellow-500 to-amber-400 bg-clip-text text-transparent">
                            {countdown}s
                        </div>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={() => navigate(`/signup${email ? `?email=${email}` : ''}`)}
                        className="w-full py-4 bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-black font-bold text-lg rounded-lg shadow-lg shadow-yellow-500/30 transition-all duration-300 transform hover:scale-105"
                    >
                        🚀 COMPLETA REGISTRAZIONE ORA
                    </button>

                    {/* Session ID (for debugging) */}
                    {sessionId && (
                        <p className="text-xs text-gray-600 mt-4">
                            Session ID: {sessionId.substring(0, 20)}...
                        </p>
                    )}
                </div>

                {/* Footer Note */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    🔒 I tuoi dati sono protetti. Riceverai accesso immediato dopo la registrazione.
                </p>
            </div>
        </div>
    );
};
