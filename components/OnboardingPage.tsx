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
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="w-full max-w-lg relative z-10">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>STEP {step}/3</span>
                        <span>PROFILAZIONE</span>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-yellow-500 transition-all duration-500"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Content Card */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-400">Salvataggio profilo...</p>
                        </div>
                    ) : (
                        <>
                            {step === 1 && renderStep1()}
                            {step === 2 && renderStep2()}
                            {step === 3 && renderStep3()}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
