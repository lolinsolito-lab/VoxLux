import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Quiz } from '../services/courses/types';
import { CheckCircle, XCircle, Award, ArrowRight, ArrowLeft, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface QuizViewProps {
    moduleId: string;
    onComplete: (passed: boolean, score: number) => void;
    onClose: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ moduleId, onComplete, onClose }) => {
    const { user } = useAuth();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const { data, error } = await supabase
                    .from('quizzes')
                    .select('*')
                    .eq('module_id', moduleId)
                    .single();

                if (error) throw error;
                setQuiz(data);
                setSelectedAnswers(new Array(data.questions.length).fill(-1));
            } catch (err) {
                console.error('Error fetching quiz:', err);
                // Fail silently or close, standard practice for optional modules
                onClose();
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [moduleId, onClose]);

    const handleAnswerSelect = (answerIndex: number) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestion] = answerIndex;
        setSelectedAnswers(newAnswers);
    };

    const handleNext = async () => {
        if (!quiz) return;

        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Calculate score
            let correctCount = 0;
            quiz.questions.forEach((q, idx) => {
                const selected = selectedAnswers[idx];
                if (selected !== -1 && q.options[selected].isCorrect) {
                    correctCount++;
                }
            });

            const percentage = Math.round((correctCount / quiz.questions.length) * 100);
            setScore(percentage);
            setShowResults(true);

            // SAVE RESULTS
            if (user) {
                setSaving(true);
                const passed = percentage >= quiz.passing_score;
                try {
                    await supabase.from('quiz_results').insert({
                        user_id: user.id,
                        quiz_id: quiz.id,
                        score: percentage,
                        passed: passed,
                        answers: selectedAnswers
                    });
                    if (passed) {
                        // Success feedback handled by UI state change
                    } else {
                        // Failure feedback handled by UI state change
                    }
                } catch (err) {
                    console.error('Error saving quiz result:', err);
                } finally {
                    setSaving(false);
                }
            }
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleFinish = () => {
        if (!quiz) return;
        const passed = score >= quiz.passing_score;
        onComplete(passed, score);
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
                <Loader className="w-10 h-10 text-amber-400 animate-spin" />
            </div>
        );
    }

    if (!quiz) return null;

    if (showResults) {
        const passed = score >= quiz.passing_score;
        const correctCount = selectedAnswers.filter(
            (ansIdx, qIdx) => quiz.questions[qIdx].options[ansIdx]?.isCorrect
        ).length;

        return (
            <div className="fixed inset-0 z-50 bg-black/95 text-gray-200 flex items-center justify-center p-4 overflow-hidden animate-fadeIn">
                <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500/20 pr-2">
                    <div className={`bg-gradient-to-b ${passed ? 'from-emerald-900/20 to-black' : 'from-red-900/20 to-black'} border ${passed ? 'border-emerald-500/30' : 'border-red-500/30'} rounded-2xl p-6 md:p-10 text-center shadow-2xl relative`}>

                        {passed ? (
                            <Award className="w-20 h-20 text-emerald-400 mx-auto mb-6 animate-bounce" />
                        ) : (
                            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                        )}

                        <h2 className="text-3xl font-display font-bold mb-4 text-white">
                            {passed ? 'Certificazione Superata' : 'Obiettivo Non Raggiunto'}
                        </h2>

                        <div className="text-6xl font-bold mb-2">
                            <span className={passed ? 'text-emerald-400' : 'text-red-400'}>{score}%</span>
                        </div>
                        <p className="text-gray-400 mb-6">
                            {correctCount} / {quiz.questions.length} risposte corrette
                        </p>

                        {passed ? (
                            <>
                                <p className="text-lg text-gray-300 mb-8">
                                    Congratulazioni. Hai dimostrato padronanza assoluta.
                                    Il Sigillo è tuo.
                                </p>
                                <button
                                    onClick={handleFinish}
                                    disabled={saving}
                                    className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold uppercase tracking-wider rounded hover:brightness-110 transition-all shadow-lg shadow-emerald-900/50"
                                >
                                    {saving ? 'Salvataggio...' : 'Reclama il Diploma 🏆'}
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-lg text-gray-300 mb-8">
                                    Richiesto: <span className="text-amber-400">{quiz.passing_score}%</span>.
                                    Rivedi i materiali e dimostra il tuo valore.
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={onClose}
                                        className="px-8 py-3 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-wider rounded hover:bg-white/10 transition-all"
                                    >
                                        Esci
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowResults(false);
                                            setCurrentQuestion(0);
                                            setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
                                            setScore(0);
                                        }}
                                        className="px-8 py-3 bg-amber-500 text-black font-bold uppercase tracking-wider rounded hover:brightness-110 transition-all"
                                    >
                                        Ritenta
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const question = quiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

    return (
        <div className="fixed inset-0 z-50 bg-black/95 text-gray-200 flex items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-zinc-900/50 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <h3 className="text-amber-500 uppercase tracking-widest text-xs font-bold">Esame Finale</h3>
                    <div className="text-xs text-gray-500">ID: {quiz.id.slice(0, 8)}</div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-400 mb-2 font-mono">
                        <span>DOMANDA {currentQuestion + 1} / {quiz.questions.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question */}
                <div className="mb-8">
                    <h3 className="text-2xl md:text-3xl font-display font-medium text-white mb-8 leading-tight">
                        {question.text}
                    </h3>

                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <button
                                key={option.id || index}
                                onClick={() => handleAnswerSelect(index)}
                                className={`w-full text-left p-6 rounded-xl border transition-all group relative overflow-hidden ${selectedAnswers[currentQuestion] === index
                                    ? 'border-amber-500 bg-amber-500/10 text-white'
                                    : 'border-white/10 hover:border-white/30 bg-white/5 text-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${selectedAnswers[currentQuestion] === index
                                        ? 'border-amber-500 bg-amber-500 text-black'
                                        : 'border-gray-500 group-hover:border-gray-300'
                                        }`}>
                                        {selectedAnswers[currentQuestion] === index && (
                                            <div className="w-2 h-2 rounded-full bg-black" />
                                        )}
                                    </div>
                                    <span className="text-lg font-light">{option.text}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer Nav */}
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className="text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500 transition-colors flex items-center gap-2 uppercase text-xs tracking-widest"
                    >
                        <ArrowLeft size={14} /> Precedente
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={selectedAnswers[currentQuestion] === -1}
                        className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-amber-400 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 disabled:bg-gray-700 disabled:text-gray-500"
                    >
                        {currentQuestion === quiz.questions.length - 1 ? 'Completa Esame' : 'Prossima'}
                    </button>
                </div>
            </div>
        </div>
    );
};
