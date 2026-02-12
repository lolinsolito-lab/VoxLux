import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings, Check } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'vox_aurea_cookie_consent';

export const CookieBanner: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [preferences, setPreferences] = useState({
        necessary: true,      // Always on
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
            // Show after a short delay for elegance
            const timer = setTimeout(() => setVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptAll = () => {
        const consent = { necessary: true, analytics: true, marketing: true, date: new Date().toISOString() };
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
        setVisible(false);
    };

    const acceptSelected = () => {
        const consent = { ...preferences, date: new Date().toISOString() };
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
        setVisible(false);
    };

    const rejectOptional = () => {
        const consent = { necessary: true, analytics: false, marketing: false, date: new Date().toISOString() };
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
        setVisible(false);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="fixed bottom-0 left-0 right-0 z-[9990] p-4 md:p-6"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                >
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-stone-950 via-stone-950 to-stone-900 border border-white/10 rounded-2xl p-6 md:p-8 shadow-[0_-8px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">

                        {/* Main content */}
                        <div className="flex flex-col md:flex-row md:items-start gap-5">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-lux-gold/10 border border-lux-gold/20 flex items-center justify-center">
                                    <Cookie className="w-6 h-6 text-lux-gold" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-display font-bold text-base md:text-lg mb-2">
                                    La tua privacy è importante
                                </h3>
                                <p className="text-stone-400 text-sm leading-relaxed">
                                    Utilizziamo cookie tecnici necessari per il funzionamento del sito e, con il tuo consenso,
                                    cookie di analisi e marketing per migliorare la tua esperienza.
                                    Puoi scegliere quali accettare o rifiutare quelli opzionali.
                                </p>
                            </div>
                        </div>

                        {/* Preferences panel */}
                        <AnimatePresence>
                            {showPreferences && (
                                <motion.div
                                    className="mt-6 pt-6 border-t border-white/[0.06] space-y-4"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Necessary */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white text-sm font-bold">Cookie Necessari</p>
                                            <p className="text-stone-500 text-xs">Essenziali per il funzionamento del sito. Non possono essere disattivati.</p>
                                        </div>
                                        <div className="w-10 h-6 rounded-full bg-lux-gold/30 flex items-center justify-end px-1 cursor-not-allowed">
                                            <div className="w-4 h-4 rounded-full bg-lux-gold" />
                                        </div>
                                    </div>

                                    {/* Analytics */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white text-sm font-bold">Cookie Analitici</p>
                                            <p className="text-stone-500 text-xs">Ci aiutano a capire come utilizzi il sito per migliorarlo.</p>
                                        </div>
                                        <button
                                            onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                                            className={`w-10 h-6 rounded-full flex items-center px-1 transition-all duration-300 ${preferences.analytics ? 'bg-lux-gold/30 justify-end' : 'bg-stone-800 justify-start'}`}
                                        >
                                            <div className={`w-4 h-4 rounded-full transition-colors duration-300 ${preferences.analytics ? 'bg-lux-gold' : 'bg-stone-600'}`} />
                                        </button>
                                    </div>

                                    {/* Marketing */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white text-sm font-bold">Cookie di Marketing</p>
                                            <p className="text-stone-500 text-xs">Utilizzati per mostrarti pubblicità pertinenti ai tuoi interessi.</p>
                                        </div>
                                        <button
                                            onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                                            className={`w-10 h-6 rounded-full flex items-center px-1 transition-all duration-300 ${preferences.marketing ? 'bg-lux-gold/30 justify-end' : 'bg-stone-800 justify-start'}`}
                                        >
                                            <div className={`w-4 h-4 rounded-full transition-colors duration-300 ${preferences.marketing ? 'bg-lux-gold' : 'bg-stone-600'}`} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6 pt-5 border-t border-white/[0.06]">
                            <button
                                onClick={() => setShowPreferences(!showPreferences)}
                                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-stone-400 text-xs uppercase tracking-wider font-bold hover:text-white hover:border-white/20 transition-all"
                            >
                                <Settings className="w-3.5 h-3.5" />
                                Personalizza
                            </button>
                            <button
                                onClick={rejectOptional}
                                className="px-5 py-2.5 rounded-xl border border-white/10 text-stone-400 text-xs uppercase tracking-wider font-bold hover:text-white hover:border-white/20 transition-all"
                            >
                                Solo Necessari
                            </button>
                            {showPreferences ? (
                                <button
                                    onClick={acceptSelected}
                                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-lux-gold text-black text-xs uppercase tracking-wider font-bold hover:bg-lux-gold/90 transition-all shadow-[0_0_20px_rgba(228,197,114,0.2)] sm:ml-auto"
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    Salva Preferenze
                                </button>
                            ) : (
                                <button
                                    onClick={acceptAll}
                                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-lux-gold text-black text-xs uppercase tracking-wider font-bold hover:bg-lux-gold/90 transition-all shadow-[0_0_20px_rgba(228,197,114,0.2)] sm:ml-auto"
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    Accetta Tutti
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
