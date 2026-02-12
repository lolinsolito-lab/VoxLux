import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, title, children }) => {

    // Lock scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="relative w-full max-w-2xl max-h-[85vh] bg-gradient-to-b from-stone-950 to-black border border-white/10 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 30 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-white/[0.06] flex-shrink-0">
                                <h2 className="text-lg md:text-xl font-display font-bold text-lux-gold tracking-wide">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-stone-500 hover:text-white hover:border-white/30 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Scrollable content */}
                            <div className="overflow-y-auto flex-1 px-6 md:px-8 py-6 scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent">
                                <div className="space-y-6 text-stone-300 text-sm leading-[1.8]">
                                    {children}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 md:px-8 py-4 border-t border-white/[0.06] flex-shrink-0">
                                <p className="text-[10px] uppercase tracking-widest text-stone-600 text-center">
                                    VOX AUREA © 2026 — Tutti i diritti riservati
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
