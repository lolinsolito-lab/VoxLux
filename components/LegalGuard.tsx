import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { Shield, FileText, Check, AlertTriangle, Lock } from 'lucide-react';
import { UserContract } from '../types';

export const LegalGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [hasSigned, setHasSigned] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [contractId] = useState(() => crypto.randomUUID());

    // Form State
    const [agreements, setAgreements] = useState({
        refund_waiver: false,
        privacy_policy: false,
        anti_piracy: false,
        marketing_consent: false
    });

    useEffect(() => {
        checkSignature();
    }, [user]);

    const checkSignature = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            // Check if user has signed the latest version of the contract
            const { data, error } = await supabase
                .from('user_contracts')
                .select('id')
                .eq('user_id', user.id)
                .eq('contract_version', 'v1.0') // Current version
                .single();

            if (data) {
                setHasSigned(true);
            } else {
                setHasSigned(false);
            }
        } catch (error) {
            console.error('Error checking contract:', error);
            // Default to not signed on error to be safe
            setHasSigned(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSign = async () => {
        if (!user) return;
        setSubmitting(true);

        try {
            // 1. Get IP Address (client-side best effort)
            const ipRes = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipRes.json();
            const ipAddress = ipData.ip;

            // 2. Insert Contract Record
            const { error } = await supabase.from('user_contracts').insert({
                id: contractId,
                user_id: user.id,
                contract_version: 'v1.0',
                ip_address: ipAddress,
                user_agent: navigator.userAgent,
                agreements: agreements,
                signed_at: new Date().toISOString()
            });

            if (error) throw error;

            // 3. Success
            setHasSigned(true);
        } catch (error) {
            console.error('Error signing contract:', error);
            alert('Errore durante la firma. Riprova.');
        } finally {
            setSubmitting(false);
        }
    };

    const allChecked = agreements.refund_waiver && agreements.privacy_policy && agreements.anti_piracy;

    if (loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div></div>;
    }

    // If not logged in, or already signed, show content
    if (!user || hasSigned) {
        return <>{children}</>;
    }

    // BLOCKING MODAL
    return (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-yellow-500/30 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600"></div>

                <div className="p-8 md:p-10">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 bg-yellow-900/20 rounded-full flex items-center justify-center mb-4 border border-yellow-500/30">
                            <Shield className="text-yellow-500" size={32} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-2">
                            PROTOCOLLO <span className="text-yellow-500">DI ACCESSO</span>
                        </h1>
                        <p className="text-zinc-400 max-w-md">
                            Per accedere alla piattaforma Vox Lux, è richiesta la firma digitale del presente accordo legale.
                        </p>
                    </div>

                    <div className="space-y-6 bg-black/40 p-6 rounded-xl border border-zinc-800/50 mb-8">
                        {/* 1. Refund Waiver */}
                        <label className="flex items-start gap-4 cursor-pointer group">
                            <div className={`mt-1 w-6 h-6 rounded flex items-center justify-center border transition-all ${agreements.refund_waiver ? 'bg-yellow-500 border-yellow-500 text-black' : 'border-zinc-600 bg-transparent group-hover:border-yellow-500/50'}`}>
                                {agreements.refund_waiver && <Check size={16} strokeWidth={4} />}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={agreements.refund_waiver}
                                onChange={(e) => setAgreements({ ...agreements, refund_waiver: e.target.checked })}
                            />
                            <div className="flex-1">
                                <span className="block font-bold text-white mb-1">Accesso Immediato al Contenuto Esclusivo</span>
                                <span className="text-sm text-zinc-400 leading-relaxed">
                                    Confermo di voler accedere <span className="text-yellow-500">immediatamente</span> ai contenuti digitali premium.
                                    Come previsto dall'art. 59 del Codice del Consumo per i contenuti digitali,
                                    l'accesso esclusivo è <span className="text-white font-semibold">immediato e definitivo</span>.
                                </span>
                            </div>
                        </label>

                        {/* 2. Anti Piracy */}
                        <label className="flex items-start gap-4 cursor-pointer group">
                            <div className={`mt-1 w-6 h-6 rounded flex items-center justify-center border transition-all ${agreements.anti_piracy ? 'bg-yellow-500 border-yellow-500 text-black' : 'border-zinc-600 bg-transparent group-hover:border-yellow-500/50'}`}>
                                {agreements.anti_piracy && <Check size={16} strokeWidth={4} />}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={agreements.anti_piracy}
                                onChange={(e) => setAgreements({ ...agreements, anti_piracy: e.target.checked })}
                            />
                            <div className="flex-1">
                                <span className="block font-bold text-white mb-1">Protezione Proprietà Intellettuale</span>
                                <span className="text-sm text-zinc-400 leading-relaxed">
                                    Il materiale è strettamente personale. È vietata la copia, condivisione o diffusione.
                                    I video contengono <span className="text-yellow-500">watermark forense</span> tracciabile. La violazione comporta azioni legali immediate e penali fino a €50.000.
                                </span>
                            </div>
                        </label>

                        {/* 3. Privacy & Terms */}
                        <label className="flex items-start gap-4 cursor-pointer group">
                            <div className={`mt-1 w-6 h-6 rounded flex items-center justify-center border transition-all ${agreements.privacy_policy ? 'bg-yellow-500 border-yellow-500 text-black' : 'border-zinc-600 bg-transparent group-hover:border-yellow-500/50'}`}>
                                {agreements.privacy_policy && <Check size={16} strokeWidth={4} />}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={agreements.privacy_policy}
                                onChange={(e) => setAgreements({ ...agreements, privacy_policy: e.target.checked })}
                            />
                            <div className="flex-1">
                                <span className="block font-bold text-white mb-1">Termini e Privacy</span>
                                <span className="text-sm text-zinc-400 leading-relaxed">
                                    Accetto i <a href="/terms" target="_blank" className="underline hover:text-white">Termini di Servizio</a> e confermo di aver letto la <a href="/privacy" target="_blank" className="underline hover:text-white">Privacy Policy</a>.
                                </span>
                            </div>
                        </label>
                    </div>

                    <button
                        onClick={handleSign}
                        disabled={!allChecked || submitting}
                        className={`w-full py-4 text-lg font-black tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-3 ${allChecked
                            ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 transform hover:scale-[1.02]'
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                            }`}
                    >
                        {submitting ? (
                            <><div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></div> FIRMA IN CORSO...</>
                        ) : (
                            <><FileText size={20} /> FIRMA DIGITALE E ACCEDI</>
                        )}
                    </button>

                    <p className="mt-4 text-center text-xs text-zinc-600 font-mono">
                        Contract ID: {contractId.split('-')[0].toUpperCase()} • IP Tracking Active • {new Date().toLocaleDateString('it-IT')}
                    </p>
                </div>
            </div>
        </div>
    );
};
