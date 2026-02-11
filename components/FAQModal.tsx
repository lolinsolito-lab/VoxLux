
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { supabase } from '../services/supabase';

interface FAQQuestion {
    id: string;
    question: string;
    answer_html: string;
    order_index: number;
}

interface FAQModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FAQModal: React.FC<FAQModalProps> = ({ isOpen, onClose }) => {
    const [questions, setQuestions] = useState<FAQQuestion[]>([]);
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchFAQs();
        }
    }, [isOpen]);

    const fetchFAQs = async () => {
        setLoading(true);
        try {
            const { data } = await supabase
                .from('faq_questions')
                .select('id, question, answer_html, order_index')
                .eq('is_public', true)
                .order('order_index');

            if (data) setQuestions(data);
        } catch (error) {
            console.error('Error loading FAQs:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-zinc-900 border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-900/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                                    <HelpCircle size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Domande Frequenti</h2>
                                    <p className="text-xs text-zinc-400">Risposte rapide per il tuo successo</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto p-6 space-y-3">
                            {loading ? (
                                <div className="text-center py-12 text-zinc-500">Caricamento...</div>
                            ) : questions.length === 0 ? (
                                <div className="text-center py-12 text-zinc-500">Nessuna domanda trovata.</div>
                            ) : (
                                questions.map((q, idx) => (
                                    <div key={q.id} className="group">
                                        <button
                                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                            className={`w-full text-left p-4 rounded-xl flex justify-between items-center transition-all duration-200 border ${openIndex === idx
                                                    ? 'bg-zinc-800/50 border-amber-500/30 text-amber-200'
                                                    : 'bg-zinc-950/30 border-white/5 hover:bg-zinc-900 hover:border-white/10 text-zinc-300'
                                                }`}
                                        >
                                            <span className="font-semibold pr-4">{q.question}</span>
                                            <ChevronDown
                                                size={18}
                                                className={`transition-transform duration-200 flex-shrink-0 ${openIndex === idx ? 'rotate-180 text-amber-500' : 'text-zinc-500'}`}
                                            />
                                        </button>
                                        <AnimatePresence>
                                            {openIndex === idx && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 pt-2 text-zinc-400 text-sm leading-relaxed pl-4 border-l-2 border-amber-500/10 ml-4 mt-2">
                                                        <div dangerouslySetInnerHTML={{ __html: q.answer_html }} />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer CTA */}
                        <div className="p-4 bg-zinc-950 border-t border-white/5 text-center">
                            <p className="text-xs text-zinc-500 mb-2">Non hai trovato la risposta?</p>
                            <div className="flex justify-center items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider">
                                <MessageSquare size={14} />
                                <span>Usa la chat in basso a destra</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
