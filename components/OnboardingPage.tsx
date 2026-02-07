import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { BRANDING } from '../config/branding';

interface OnboardingData {
    experience_level: string;
    primary_goal: string;
    struggle: string;
}

export const OnboardingPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<OnboardingData>({
        experience_level: '',
        primary_goal: '',
        struggle: ''
    });

    const handleOptionSelect = (key: keyof OnboardingData, value: string) => {
        setData(prev => ({ ...prev, [key]: value }));
        if (step < 3) {
            setStep(prev => prev + 1);
        } else {
            handleSubmit({ ...data, [key]: value });
        }
    };

    const handleSubmit = async (finalData: OnboardingData) => {
        setLoading(true);
        try {
            if (user) {
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        onboarding_completed: true,
                        onboarding_data: finalData
                    })
                    .eq('id', user.id);

                if (error) throw error;
            }
            // Navigate to Dashboard after successful save
            navigate('/dashboard');
        } catch (error) {
            console.error('Error saving onboarding data:', error);
            // Navigate anyway to not block user
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    // Step 1: Experience Level
    const renderStep1 = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-6">Qual è la tua esperienza attuale?</h3>
            <div className="grid gap-4">
                {[
                    { label: 'Novizio Assoluto', desc: 'Non ho mai fatto business online', value: 'novice' },
                    { label: 'Apprendista', desc: 'Ho provato ma senza grandi risultati', value: 'apprentice' },
                    { label: 'Esperto', desc: 'Ho già un business ma voglio scalare', value: 'expert' }
                ].map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => handleOptionSelect('experience_level', opt.value)}
                        className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-yellow-500/50 transition-all text-left group"
                    >
                        <div className="font-bold text-white group-hover:text-yellow-500">{opt.label}</div>
                        <div className="text-sm text-gray-400">{opt.desc}</div>
                    </button>
                ))}
            </div>
        </div>
    );

    // Step 2: Primary Goal
    const renderStep2 = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-6">Qual è il tuo obiettivo principale?</h3>
            <div className="grid gap-4">
                {[
                    { label: 'Soldi Rapidi', desc: 'Voglio generare cashflow immediato', value: 'cashflow' },
                    { label: 'Brand Building', desc: 'Voglio creare un impero a lungo termine', value: 'brand' },
                    { label: 'Libertà', desc: 'Voglio automatizzare tutto e viaggiare', value: 'freedom' }
                ].map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => handleOptionSelect('primary_goal', opt.value)}
                        className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-yellow-500/50 transition-all text-left group"
                    >
                        <div className="font-bold text-white group-hover:text-yellow-500">{opt.label}</div>
                        <div className="text-sm text-gray-400">{opt.desc}</div>
                    </button>
                ))}
            </div>
        </div>
    );

    // Step 3: Struggle
    const renderStep3 = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-6">Cosa ti blocca di più oggi?</h3>
            <div className="grid gap-4">
                {[
                    { label: 'Tecnica', desc: 'Non so usare gli strumenti AI/Web', value: 'tech' },
                    { label: 'Strategia', desc: 'So fare cose ma non ho un piano', value: 'strategy' },
                    { label: 'Mindset', desc: 'Ho paura di fallire o procrastino', value: 'mindset' }
                ].map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => handleOptionSelect('struggle', opt.value)}
                        className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-yellow-500/50 transition-all text-left group"
                    >
                        <div className="font-bold text-white group-hover:text-yellow-500">{opt.label}</div>
                        <div className="text-sm text-gray-400">{opt.desc}</div>
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#00040A] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-yellow-500/30">
            {/* 🌌 Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-[80px] animate-pulse-slow delay-700"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <div className="w-full max-w-2xl relative z-10">

                {/* Matrix Header */}
                <div className="text-center mb-10">
                    <div className="inline-block border border-yellow-500/30 bg-yellow-900/10 px-3 py-1 rounded text-[10px] tracking-[0.3em] text-yellow-500 uppercase mb-4 animate-fade-in">
                        Protocollo Inizializzazione
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent uppercase tracking-tight mb-2">
                        Calibrazione Neurale
                    </h1>
                    <p className="text-gray-400 font-mono text-xs tracking-wider">
                        CONFIGURAZIONE SISTEMA: UTENTE {user?.email?.split('@')[0].toUpperCase()}
                    </p>
                </div>

                {/* Progress Bar (High Tech) */}
                <div className="mb-10 relative">
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono mb-2 uppercase tracking-wider">
                        <span>Fase {step}/3</span>
                        <span>{step === 1 ? 'Analisi Livello' : step === 2 ? 'Definizione Obiettivo' : 'Identificazione Blocco'}</span>
                    </div>
                    <div className="h-1 bg-gray-900 rounded-full overflow-hidden border border-white/5">
                        <div
                            className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)] transition-all duration-700 ease-out relative"
                            style={{ width: `${(step / 3) * 100}%` }}
                        >
                            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Content Card */}
                <div className="backdrop-blur-2xl bg-[#0A0A0A]/80 border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl animate-fade-in-up">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-[0_0_20px_rgba(234,179,8,0.2)]"></div>
                            <h3 className="text-xl font-bold text-white mb-2">Elaborazione Dati...</h3>
                            <p className="text-gray-500 font-mono text-xs">CRITTOGRAFIA END-TO-END IN CORSO</p>
                        </div>
                    ) : (
                        <>
                            {step === 1 && renderStep1()}
                            {step === 2 && renderStep2()}
                            {step === 3 && renderStep3()}
                        </>
                    )}
                </div>

                {/* Footer Status */}
                <div className="mt-8 flex justify-center gap-8 text-[9px] text-gray-600 font-mono uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                        System Online
                    </span>
                    <span>v.4.0.5-ELITE</span>
                </div>
            </div>

            <style>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.3; transform: scale(1.1); }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-pulse-slow { animation: pulse-slow 8s infinite ease-in-out; }
                .animate-fade-in { animation: fade-in 1s ease-out forwards; }
                .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

                /* Custom Button Styles Override */
                button {
                    position: relative;
                    overflow: hidden;
                }
                button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    width: 2px;
                    background: #EAB308;
                    transform: scaleY(0);
                    transition: transform 0.3s ease;
                }
                button:hover::before {
                    transform: scaleY(1);
                }
            `}</style>
        </div>
    );
};
