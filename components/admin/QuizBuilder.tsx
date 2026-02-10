import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Check, AlertCircle, Save, CheckCircle2 } from 'lucide-react';
import { Quiz, QuizQuestion, QuestionOption } from '../../services/courses/types';
import { quizService } from '../../services/quiz';

interface QuizBuilderProps {
    moduleId: string;
    moduleTitle: string;
    onClose: () => void;
}

export const QuizBuilder: React.FC<QuizBuilderProps> = ({ moduleId, moduleTitle, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [quiz, setQuiz] = useState<Partial<Quiz>>({
        module_id: moduleId,
        title: `Verifica: ${moduleTitle}`,
        description: 'Metti alla prova le tue conoscenze per sbloccare il prossimo modulo.',
        passing_score: 80,
        questions: []
    });

    // Load existing quiz
    useEffect(() => {
        const loadQuiz = async () => {
            try {
                const data = await quizService.getByModuleId(moduleId);
                if (data) {
                    setQuiz(data);
                }
            } catch (err) {
                console.error("Failed to load quiz", err);
            } finally {
                setLoading(false);
            }
        };
        loadQuiz();
    }, [moduleId]);

    // Save Quiz
    const handleSave = async () => {
        setSaving(true);
        try {
            // Basic Validation
            if (!quiz.title || (quiz.questions?.length || 0) === 0) {
                alert("Completa il titolo e aggiungi almeno una domanda.");
                setSaving(false);
                return;
            }

            // Ensure valid questions
            const validQuestions = quiz.questions?.filter(q => q.text.trim() !== '' && q.options.length >= 2);
            if ((validQuestions?.length || 0) < (quiz.questions?.length || 0)) {
                if (!confirm("Alcune domande incomplete verranno rimosse. Continuare?")) {
                    setSaving(false);
                    return;
                }
            }

            await quizService.saveQuiz({
                ...quiz,
                questions: validQuestions,
                module_id: moduleId // Ensure link
            });
            alert("Quiz salvato con successo!");
            onClose();
        } catch (err) {
            alert("Errore durante il salvataggio.");
        } finally {
            setSaving(false);
        }
    };

    // --- QUESTION MANAGEMENT ---

    const addQuestion = () => {
        const newQ: QuizQuestion = {
            id: crypto.randomUUID(),
            text: '',
            options: [
                { id: crypto.randomUUID(), text: '', isCorrect: false },
                { id: crypto.randomUUID(), text: '', isCorrect: false }
            ],
            points: 10,
            explanation: ''
        };
        setQuiz(prev => ({ ...prev, questions: [...(prev.questions || []), newQ] }));
    };

    const updateQuestion = (qId: string, updates: Partial<QuizQuestion>) => {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions?.map(q => q.id === qId ? { ...q, ...updates } : q)
        }));
    };

    const removeQuestion = (qId: string) => {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions?.filter(q => q.id !== qId)
        }));
    };

    // --- OPTION MANAGEMENT ---

    const updateOption = (qId: string, optId: string, text: string) => {
        const questions = [...(quiz.questions || [])];
        const qIndex = questions.findIndex(q => q.id === qId);
        if (qIndex === -1) return;

        const opts = [...questions[qIndex].options];
        const optIndex = opts.findIndex(o => o.id === optId);
        if (optIndex === -1) return;

        opts[optIndex] = { ...opts[optIndex], text };
        questions[qIndex] = { ...questions[qIndex], options: opts };
        setQuiz({ ...quiz, questions });
    };

    const setCorrectOption = (qId: string, optId: string) => {
        const questions = [...(quiz.questions || [])];
        const qIndex = questions.findIndex(q => q.id === qId);
        if (qIndex === -1) return;

        // Single choice logic: Set one as true, others false
        const opts = questions[qIndex].options.map(o => ({
            ...o,
            isCorrect: o.id === optId
        }));

        questions[qIndex] = { ...questions[qIndex], options: opts };
        setQuiz({ ...quiz, questions });
    };

    const addOption = (qId: string) => {
        const questions = [...(quiz.questions || [])];
        const qIndex = questions.findIndex(q => q.id === qId);
        if (qIndex === -1) return;

        questions[qIndex].options.push({
            id: crypto.randomUUID(),
            text: '',
            isCorrect: false
        });
        setQuiz({ ...quiz, questions });
    };

    const removeOption = (qId: string, optId: string) => {
        const questions = [...(quiz.questions || [])];
        const qIndex = questions.findIndex(q => q.id === qId);
        if (qIndex === -1) return;

        questions[qIndex].options = questions[qIndex].options.filter(o => o.id !== optId);
        setQuiz({ ...quiz, questions });
    };


    if (loading) return <div className="p-8 text-white/50">Caricamento Quiz...</div>;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8 animate-fadeIn">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-5xl h-full max-h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col shadow-2xl relative overflow-hidden"
            >
                {/* HEAD */}
                <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                            <CheckCircle2 className="text-green-400" size={20} />
                            Quiz Builder: <span className="text-white/60 font-normal">{moduleTitle}</span>
                        </h2>
                        <p className="text-xs text-white/40">Crea un test per verificare l'apprendimento.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm"
                        >
                            Annulla
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-400 text-black font-bold text-sm shadow-[0_0_15px_rgba(74,222,128,0.3)] flex items-center gap-2 transition-all"
                        >
                            {saving ? 'Salvataggio...' : <><Save size={16} /> Salva Quiz</>}
                        </button>
                    </div>
                </div>

                {/* BODY - SCROLLABLE */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">

                    {/* SETTINGS CARD */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Impostazioni Generali</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs text-white/40 mb-2">Titolo Quiz</label>
                                <input
                                    value={quiz.title}
                                    onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-white/20 focus:border-green-500/50 outline-none transition-colors"
                                    placeholder="Es. Verifica Modulo 1"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-white/40 mb-2">Punteggio Minimo (%)</label>
                                <input
                                    type="number"
                                    value={quiz.passing_score}
                                    onChange={(e) => setQuiz({ ...quiz, passing_score: parseInt(e.target.value) })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-green-500/50 outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs text-white/40 mb-2">Descrizione (Opzionale)</label>
                                <input
                                    value={quiz.description || ''}
                                    onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-green-500/50 outline-none"
                                    placeholder="Breve introduzione per lo studente..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* QUESTIONS LIST */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-end border-b border-white/5 pb-2">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Domande ({quiz.questions?.length})</h3>
                            <button
                                onClick={addQuestion}
                                className="text-xs flex items-center gap-1 text-green-400 hover:text-green-300 font-medium px-3 py-1 rounded bg-green-900/10 hover:bg-green-900/20 border border-green-500/20 transition-all"
                            >
                                <Plus size={14} /> Aggiungi Domanda
                            </button>
                        </div>

                        {quiz.questions?.length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl text-white/20">
                                Nessuna domanda aggiunta. Inizia ora!
                            </div>
                        )}

                        <AnimatePresence>
                            {quiz.questions?.map((q, idx) => (
                                <motion.div
                                    key={q.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-black/40 border border-white/10 rounded-xl overflow-hidden group"
                                >
                                    {/* Question Header */}
                                    <div className="p-4 bg-white/5 flex items-start gap-4 border-b border-white/5">
                                        <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white/40 shrink-0">
                                            {idx + 1}
                                        </span>
                                        <div className="flex-1">
                                            <input
                                                value={q.text}
                                                onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                                                className="w-full bg-transparent text-lg font-medium text-white placeholder-white/20 outline-none"
                                                placeholder="Scrivi qui la domanda..."
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeQuestion(q.id)}
                                            className="p-2 hover:bg-red-500/10 hover:text-red-400 text-white/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {/* Options & Settings */}
                                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

                                        {/* OPTIONS COL */}
                                        <div className="lg:col-span-2 space-y-3">
                                            <label className="block text-xs uppercase tracking-widest text-white/30 mb-2">Opzioni di Risposta</label>
                                            {q.options.map((opt, oIdx) => (
                                                <div key={opt.id} className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => setCorrectOption(q.id, opt.id)}
                                                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${opt.isCorrect ? 'border-green-500 bg-green-500/20 text-green-500' : 'border-white/20 text-transparent hover:border-white/40'}`}
                                                    >
                                                        <Check size={14} />
                                                    </button>
                                                    <input
                                                        value={opt.text}
                                                        onChange={(e) => updateOption(q.id, opt.id, e.target.value)}
                                                        className={`flex-1 bg-white/5 border ${opt.isCorrect ? 'border-green-500/30' : 'border-white/10'} rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:border-white/30 outline-none transition-colors`}
                                                        placeholder={`Opzione ${oIdx + 1}`}
                                                    />
                                                    <button onClick={() => removeOption(q.id, opt.id)} className="text-white/20 hover:text-red-400 p-1">
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => addOption(q.id)}
                                                className="text-xs text-white/40 hover:text-white flex items-center gap-1 mt-2 pl-9 transition-colors"
                                            >
                                                <Plus size={12} /> Aggiungi Opzione
                                            </button>
                                        </div>

                                        {/* META COL */}
                                        <div className="space-y-4 bg-white/2 p-4 rounded-xl border border-white/5 h-fit">
                                            <div>
                                                <label className="block text-xs uppercase tracking-widest text-white/30 mb-2">Spiegazione (Opzionale)</label>
                                                <textarea
                                                    value={q.explanation || ''}
                                                    onChange={(e) => updateQuestion(q.id, { explanation: e.target.value })}
                                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-xs text-white placeholder-white/20 focus:border-white/30 outline-none resize-none h-24"
                                                    placeholder="Mostrata dopo la risposta..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs uppercase tracking-widest text-white/30 mb-2">Punti</label>
                                                <input
                                                    type="number"
                                                    value={q.points}
                                                    onChange={(e) => updateQuestion(q.id, { points: parseInt(e.target.value) })}
                                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-white/30 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* VALIDATION WARNING */}
                                    {(!q.text || q.options.length < 2 || !q.options.some(o => o.isCorrect)) && (
                                        <div className="bg-amber-900/20 border-t border-amber-500/10 p-2 px-4 flex items-center gap-2 text-amber-500/60 text-xs">
                                            <AlertCircle size={12} />
                                            <span>Completa la domanda: testo, 2+ opzioni, 1 risposta corretta.</span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};
