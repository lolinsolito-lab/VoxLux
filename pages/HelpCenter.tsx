import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, HelpCircle, ChevronDown, ChevronRight,
    BookOpen, CreditCard, Cpu, User, MessageSquare
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { SupportWidget } from '../components/SupportWidget';
import { useAuth } from '../contexts/AuthContext';

// INTERFACES
interface FAQCategory {
    id: string;
    title: string;
    description: string;
    icon: string;
    order_index: number;
}

interface FAQQuestion {
    id: string;
    category_id: string;
    question: string;
    answer_html: string;
    order_index: number;
}

const ICON_MAP: Record<string, any> = {
    'User': User,
    'CreditCard': CreditCard,
    'BookOpen': BookOpen,
    'Cpu': Cpu,
    'HelpCircle': HelpCircle
};

export const HelpCenter: React.FC = () => {
    const { user } = useAuth();
    const [categories, setCategories] = useState<FAQCategory[]>([]);
    const [questions, setQuestions] = useState<FAQQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: cats } = await supabase.from('faq_categories').select('*').order('order_index');
            const { data: qs } = await supabase.from('faq_questions').select('*').eq('is_public', true).order('order_index');

            setCategories(cats || []);
            setQuestions(qs || []);
        } catch (error) {
            console.error('Error fetching Help Center data:', error);
        } finally {
            setLoading(false);
        }
    };

    // FILTER LOGIC
    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.answer_html.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? q.category_id === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    const activeCategory = categories.find(c => c.id === selectedCategory);

    return (
        <div className="min-h-screen bg-lux-black text-white p-4 md:p-8 overflow-y-auto">

            {/* HEADER */}
            <div className="max-w-4xl mx-auto mb-12 text-center">
                <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-lux-gold via-white to-lux-gold mb-4">
                    Come possiamo aiutarti, {(user as any)?.user_metadata?.full_name?.split(' ')[0]}?
                </h1>
                <p className="text-zinc-400 mb-8">
                    Cerca una risposta o esplora le categorie. Se non trovi soluzione, il supporto è a un click.
                </p>

                {/* SEARCH BAR */}
                <div className="relative max-w-2xl mx-auto group">
                    <div className="absolute inset-0 bg-lux-gold/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
                    <div className="relative flex items-center bg-zinc-900 border border-white/10 rounded-full px-6 py-4 shadow-xl focus-within:border-lux-gold/50 transition-colors">
                        <Search className="text-zinc-500 mr-4" size={24} />
                        <input
                            type="text"
                            placeholder="Cerca 'fattura', 'reset password', 'modulo 5'..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-white w-full placeholder-zinc-600 text-lg"
                        />
                    </div>
                </div>
            </div>

            {/* CATEGORIES GRID (Only show if no search term) */}
            {!searchTerm && !selectedCategory && (
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {categories.map((cat, idx) => {
                        const Icon = ICON_MAP[cat.icon] || HelpCircle;
                        return (
                            <motion.button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl hover:bg-zinc-800 hover:border-lux-gold/30 transition-all text-left group"
                            >
                                <div className="bg-zinc-950 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Icon className="text-lux-gold" size={24} />
                                </div>
                                <h3 className="font-bold text-lg mb-1 group-hover:text-lux-gold transition-colors">{cat.title}</h3>
                                <p className="text-xs text-zinc-500">{cat.description}</p>
                            </motion.button>
                        );
                    })}
                </div>
            )}

            {/* QUESTIONS LIST */}
            <div className="max-w-3xl mx-auto space-y-4">
                {selectedCategory && (
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className="flex items-center gap-2 text-zinc-500 hover:text-white mb-6 transition-colors"
                    >
                        <ChevronDown className="rotate-90" size={16} />
                        Torna alle Categorie
                    </button>
                )}

                {selectedCategory && (
                    <div className="mb-6 flex items-center gap-3">
                        <h2 className="text-2xl font-bold">{activeCategory?.title}</h2>
                        <span className="bg-zinc-800 text-xs px-2 py-1 rounded-full text-zinc-400">
                            {filteredQuestions.length} articoli
                        </span>
                    </div>
                )}

                {filteredQuestions.length === 0 ? (
                    <div className="text-center py-12 bg-zinc-900/30 rounded-2xl border border-white/5 border-dashed">
                        <p className="text-zinc-500 mb-4">Nessun risultato trovato.</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="text-lux-gold hover:underline"
                        >
                            Cancella ricerca
                        </button>
                    </div>
                ) : (
                    filteredQuestions.map((q) => (
                        <motion.div
                            key={q.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors"
                        >
                            <button
                                onClick={() => setOpenQuestionId(openQuestionId === q.id ? null : q.id)}
                                className="w-full flex items-center justify-between p-5 text-left"
                            >
                                <span className={`font-medium ${openQuestionId === q.id ? 'text-lux-gold' : 'text-zinc-200'}`}>
                                    {q.question}
                                </span>
                                <ChevronDown
                                    size={20}
                                    className={`transition-transform duration-300 text-zinc-500 ${openQuestionId === q.id ? 'rotate-180 text-lux-gold' : ''}`}
                                />
                            </button>
                            <AnimatePresence>
                                {openQuestionId === q.id && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'auto' }}
                                        exit={{ height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-5 pt-0 text-zinc-400 border-t border-white/5 bg-black/20 text-sm leading-relaxed">
                                            <div dangerouslySetInnerHTML={{ __html: q.answer_html }} />

                                            <div className="mt-4 pt-4 border-t border-white/5 flex gap-4">
                                                <button className="text-xs text-zinc-500 hover:text-green-400 flex items-center gap-1">
                                                    👍 Utile
                                                </button>
                                                <button className="text-xs text-zinc-500 hover:text-red-400 flex items-center gap-1">
                                                    👎 Non utile
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                )}
            </div>

            {/* STILL STUCK? CTA */}
            <div className="max-w-3xl mx-auto mt-16 p-8 bg-gradient-to-r from-zinc-900 to-black border border-lux-gold/20 rounded-2xl text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-lux-gold/5 rounded-full blur-[80px] group-hover:bg-lux-gold/10 transition-colors"></div>

                <h3 className="text-xl font-bold text-white mb-2 relative z-10">Non hai trovato la risposta?</h3>
                <p className="text-zinc-400 mb-6 relative z-10">Il nostro team di supporto è pronto ad aiutarti direttamente.</p>

                {/* Visual cue to the widget - technically the widget is floating, so we can just say "Use the chat" */}
                <div className="flex justify-center items-center gap-2 text-lux-gold font-bold uppercase tracking-widest text-xs relative z-10">
                    <MessageSquare size={16} />
                    <span>Usa il widget in basso a destra ↘️</span>
                </div>
            </div>

        </div>
    );
};
