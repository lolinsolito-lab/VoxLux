import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';
import { supabase } from '../services/supabase';

// INTERFACES
interface FAQQuestion {
    id: string;
    question: string;
    answer_html: string;
    order_index: number;
}

export const HeroFAQ: React.FC = () => {
    const [questions, setQuestions] = useState<FAQQuestion[]>([]);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    useEffect(() => {
        fetchPublicFAQs();
    }, []);

    const fetchPublicFAQs = async () => {
        try {
            // Fetch questions that are public (you might want to filter by a specific category 'Public' later via joins if needed)
            const { data } = await supabase
                .from('faq_questions')
                .select('id, question, answer_html, order_index')
                .eq('is_public', true)
                .order('order_index')
                .limit(6); // Limit to top 6 for the landing page

            if (data) setQuestions(data);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        }
    };

    if (questions.length === 0) return null;

    return (
        <section className="w-full py-24 bg-black relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lux-gold/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-2xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lux-gold/10 border border-lux-gold/20 text-lux-gold text-xs uppercase tracking-widest mb-4">
                        <HelpCircle size={14} />
                        <span>Supporto & Chiarezza</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-6">
                        Domande Frequenti
                    </h2>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                        Tutto quello che devi sapere prima di iniziare la tua ascensione.
                        Nessuna sorpresa, solo trasparenza assoluta.
                    </p>
                </div>

                {/* FAQ Grid */}
                <div className="grid gap-4">
                    {questions.map((q, idx) => (
                        <div key={q.id} className="group">
                            <motion.button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className={`w-full text-left p-6 rounded-2xl flex justify-between items-center transition-all duration-300 border backdrop-blur-md ${openIndex === idx
                                    ? 'bg-zinc-900/80 border-lux-gold/30 shadow-[0_0_30px_rgba(228,197,114,0.05)]'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                    }`}
                            >
                                <span className={`font-bold text-lg ${openIndex === idx ? 'text-lux-gold' : 'text-zinc-200'}`}>
                                    {q.question}
                                </span>
                                <ChevronDown
                                    className={`transition-transform duration-300 text-zinc-500 ${openIndex === idx ? 'rotate-180 text-lux-gold' : ''}`}
                                    size={20}
                                />
                            </motion.button>

                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-4 text-zinc-400 leading-relaxed border-l border-lux-gold/10 ml-6">
                                            <div dangerouslySetInnerHTML={{ __html: q.answer_html }} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Trust Footer */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-2 text-zinc-500 text-sm tracking-wide">
                        <ShieldCheck size={16} className="text-green-500" />
                        <span>Garanzia Soddisfatti o Rimborsati 30 Giorni • Pagamenti Sicuri Stripe</span>
                    </div>
                </div>

            </div>
        </section>
    );
};
