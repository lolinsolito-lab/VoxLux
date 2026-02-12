import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Crown, Lock, ArrowRight } from 'lucide-react';

interface SmartUpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: () => void;
    price: number;
}

const SmartUpgradeModal: React.FC<SmartUpgradeModalProps> = ({ isOpen, onClose, onUpgrade, price }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative z-10 w-full max-w-lg bg-gradient-to-b from-gray-900 to-black border border-purple-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.2)]"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20"
                        >
                            <X size={24} />
                        </button>

                        {/* Decoration */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/20 blur-3xl rounded-full pointer-events-none"></div>

                        <div className="p-6 md:p-8">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 mb-4 animate-pulse">
                                    <Crown size={32} className="text-purple-400" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                    Completa la Tua Ascensione
                                </h2>
                                <p className="text-gray-400 text-sm md:text-base">
                                    Guerriero, possiedi già Le Matrici. <br />
                                    Ti manca solo l'accesso al Cerchio Interno.
                                </p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                                    <div className="bg-green-500/20 p-2 rounded-full">
                                        <CheckCircle size={20} className="text-green-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold text-sm">Matrice I & II</h4>
                                        <p className="text-xs text-gray-500">Già in tuo possesso</p>
                                    </div>
                                </div>

                                <div className="border-l-2 border-dashed border-purple-500/30 ml-8 h-6 my-[-8px]"></div>

                                <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">UPGRADE</div>
                                    <h4 className="text-purple-300 font-bold mb-3 flex items-center gap-2">
                                        Cosa Sblocchi Ora:
                                    </h4>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-3 text-sm text-gray-300">
                                            <Crown size={16} className="text-yellow-500 shrink-0" />
                                            <span>Elite Inner Circle Membership <span className="text-gray-500 text-xs">(Valore €997)</span></span>
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-gray-300">
                                            <Lock size={16} className="text-purple-400 shrink-0" />
                                            <span>Cripte Vocali - Archivio Segreto</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-gray-300">
                                            <CheckCircle size={16} className="text-green-400 shrink-0" />
                                            <span>Priority 1-on-1 Access</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <button
                                onClick={onUpgrade}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2 group"
                            >
                                <span>Effettua Upgrade • €{(price / 100).toFixed(0)}</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            <p className="text-center text-xs text-gray-500 mt-4">
                                Pagamento sicuro & cifrato via Stripe. Accesso immediato.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SmartUpgradeModal;
