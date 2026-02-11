import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HelpCircle, Plus, Search, Edit2, Trash2,
    Save, X, ChevronDown, ChevronRight, GripVertical, Check
} from 'lucide-react';
import { supabase } from '../../services/supabase';

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
    is_public: boolean;
    order_index: number;
    helpful_count: number;
}

export const AdminFAQ: React.FC = () => {
    // STATE
    const [categories, setCategories] = useState<FAQCategory[]>([]);
    const [questions, setQuestions] = useState<FAQQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // MODALS
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

    // EDITING STATE
    const [editingCategory, setEditingCategory] = useState<Partial<FAQCategory>>({});
    const [editingQuestion, setEditingQuestion] = useState<Partial<FAQQuestion>>({});

    // INITIAL LOAD
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: cats } = await supabase.from('faq_categories').select('*').order('order_index');
            const { data: qs } = await supabase.from('faq_questions').select('*').order('order_index');

            setCategories(cats || []);
            setQuestions(qs || []);
            if (cats && cats.length > 0 && !selectedCategory) {
                setSelectedCategory(cats[0].id);
            }
        } catch (error) {
            console.error('Error fetching FAQ data:', error);
        } finally {
            setLoading(false);
        }
    };

    // CRUD OPERATIONS - CATEGORY
    const saveCategory = async () => {
        try {
            if (editingCategory.id) {
                await supabase.from('faq_categories').update(editingCategory).eq('id', editingCategory.id);
            } else {
                await supabase.from('faq_categories').insert([editingCategory]);
            }
            setIsCategoryModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    const deleteCategory = async (id: string) => {
        if (!confirm('Eliminare questa categoria e tutte le sue domande?')) return;
        await supabase.from('faq_categories').delete().eq('id', id);
        fetchData();
    };

    // CRUD OPERATIONS - QUESTION
    const saveQuestion = async () => {
        try {
            if (editingQuestion.id) {
                await supabase.from('faq_questions').update(editingQuestion).eq('id', editingQuestion.id);
            } else {
                await supabase.from('faq_questions').insert([{ ...editingQuestion, category_id: selectedCategory }]);
            }
            setIsQuestionModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error saving question:', error);
        }
    };

    const deleteQuestion = async (id: string) => {
        if (!confirm('Eliminare questa domanda?')) return;
        await supabase.from('faq_questions').delete().eq('id', id);
        fetchData();
    };

    // FILTERED QUESTIONS
    const activeQuestions = questions.filter(q => q.category_id === selectedCategory);

    return (
        <div className="p-8 max-w-7xl mx-auto text-white min-h-screen">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <HelpCircle className="text-amber-500" size={32} />
                        Gestione FAQ
                    </h1>
                    <p className="text-zinc-400 mt-1">Gestisci la Knowledge Base per ridurre i ticket di supporto.</p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">

                {/* SIDEBAR - CATEGORIES */}
                <div className="col-span-4 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Categorie</h3>
                        <button
                            onClick={() => { setEditingCategory({}); setIsCategoryModalOpen(true); }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-amber-500"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {categories.map(cat => (
                            <motion.div
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-4 rounded-xl cursor-pointer border transition-all group relative ${selectedCategory === cat.id
                                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-200'
                                        : 'bg-zinc-900 border-white/5 hover:border-white/10 text-zinc-400'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">{cat.title}</span>
                                    {selectedCategory === cat.id && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setEditingCategory(cat); setIsCategoryModalOpen(true); }}
                                                className="p-1 hover:text-white"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteCategory(cat.id); }}
                                                className="p-1 hover:text-red-500"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs opacity-60 mt-1 truncate">{cat.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* MAIN CONTENT - QUESTIONS */}
                <div className="col-span-8">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 min-h-[600px]">

                        {/* TOOLBAR */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                {categories.find(c => c.id === selectedCategory)?.title || 'Seleziona Categoria'}
                                <span className="bg-white/10 text-xs px-2 py-1 rounded-full text-zinc-400">
                                    {activeQuestions.length} articoli
                                </span>
                            </h2>
                            <button
                                onClick={() => { setEditingQuestion({ is_public: true }); setIsQuestionModalOpen(true); }}
                                disabled={!selectedCategory}
                                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus size={18} />
                                Nuova Domanda
                            </button>
                        </div>

                        {/* QUESTIONS LIST */}
                        <div className="space-y-4">
                            {activeQuestions.length === 0 ? (
                                <div className="text-center py-20 text-zinc-500">
                                    <HelpCircle size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>Nessuna domanda in questa categoria.</p>
                                </div>
                            ) : (
                                activeQuestions.map((q, index) => (
                                    <motion.div
                                        key={q.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-zinc-950 border border-white/5 rounded-xl p-4 group hover:border-amber-500/30 transition-all"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-lg mb-2 text-zinc-200">{q.question}</h3>
                                                <div
                                                    className="text-zinc-400 text-sm line-clamp-2 prose prose-invert max-w-none"
                                                    dangerouslySetInnerHTML={{ __html: q.answer_html }}
                                                />
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => { setEditingQuestion(q); setIsQuestionModalOpen(true); }}
                                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-amber-500"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteQuestion(q.id)}
                                                    className="p-2 bg-white/5 hover:bg-red-900/20 rounded-lg text-zinc-500 hover:text-red-500"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex items-center gap-4 text-xs text-zinc-600">
                                            <span className={`px-2 py-0.5 rounded ${q.is_public ? 'bg-green-900/20 text-green-500' : 'bg-red-900/20 text-red-500'}`}>
                                                {q.is_public ? 'Pubblico' : 'Bozza'}
                                            </span>
                                            <span>👀 {q.helpful_count} utile</span>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL: CATEGORY */}
            <AnimatePresence>
                {isCategoryModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-[400px] shadow-2xl"
                        >
                            <h2 className="text-xl font-bold mb-4">
                                {editingCategory.id ? 'Modifica Categoria' : 'Nuova Categoria'}
                            </h2>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Titolo Categoria"
                                    value={editingCategory.title || ''}
                                    onChange={e => setEditingCategory({ ...editingCategory, title: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-amber-500"
                                />
                                <textarea
                                    placeholder="Descrizione breve"
                                    value={editingCategory.description || ''}
                                    onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-amber-500 h-24 resize-none"
                                />
                                <div className="flex justify-end gap-3 pt-4">
                                    <button onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 text-zinc-400 hover:text-white">Annulla</button>
                                    <button onClick={saveCategory} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg font-bold">Salva</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL: QUESTION */}
            <AnimatePresence>
                {isQuestionModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-[600px] shadow-2xl"
                        >
                            <h2 className="text-xl font-bold mb-4">
                                {editingQuestion.id ? 'Modifica FAQ' : 'Nuova FAQ'}
                            </h2>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Domanda"
                                    value={editingQuestion.question || ''}
                                    onChange={e => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-amber-500 font-bold"
                                />
                                <textarea
                                    placeholder="Risposta (puoi usare HTML semplice)"
                                    value={editingQuestion.answer_html || ''}
                                    onChange={e => setEditingQuestion({ ...editingQuestion, answer_html: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-amber-500 h-64 font-mono text-sm"
                                />
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={editingQuestion.is_public ?? true}
                                        onChange={e => setEditingQuestion({ ...editingQuestion, is_public: e.target.checked })}
                                        className="w-4 h-4 rounded bg-zinc-800 border-zinc-600 text-amber-600 focus:ring-amber-500"
                                    />
                                    <label className="text-sm text-zinc-400">Visibile Pubblicamente</label>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button onClick={() => setIsQuestionModalOpen(false)} className="px-4 py-2 text-zinc-400 hover:text-white">Annulla</button>
                                    <button onClick={saveQuestion} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg font-bold">Salva</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};
