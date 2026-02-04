import React, { useState } from 'react';
import { CourseQuiz } from '../services/courseData';
import { CheckCircle, XCircle, Award, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface QuizViewProps {
    quiz: CourseQuiz;
    courseId: string;
    onComplete: (passed: boolean, score: number) => void;
    onClose: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ quiz, courseId, onComplete, onClose }) => {
    const { user } = useAuth();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(quiz.questions.length).fill(-1));
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    const handleAnswerSelect = (answerIndex: number) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestion] = answerIndex;
        setSelectedAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Calculate score
            const correct = selectedAnswers.filter(
                (answer, index) => answer === quiz.questions[index].correctAnswer
            ).length;
            const percentage = Math.round((correct / quiz.questions.length) * 100);
            setScore(percentage);
            setShowResults(true);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleFinish = () => {
        const passed = score >= quiz.passingScore;
        onComplete(passed, score);
    };

    if (showResults) {
        const passed = score >= quiz.passingScore;
        const correctCount = selectedAnswers.filter(
            (answer, index) => answer === quiz.questions[index].correctAnswer
        ).length;

        return (
            <div className="fixed inset-0 z-50 bg-lux-black/95 text-gray-200 flex items-center justify-center p-4 overflow-hidden">
                <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-lux-gold/20 scrollbar-track-transparent pr-2">
                    <div className={`bg-gradient-to-b ${passed ? 'from-lux-cyan/10 to-lux-black' : 'from-red-900/10 to-lux-black'} border ${passed ? 'border-lux-cyan/30' : 'border-red-500/30'} rounded-2xl p-6 md:p-10 text-center shadow-2xl relative overflow-hidden`}>


                        {passed ? (
                            <Award className="w-20 h-20 text-lux-cyan mx-auto mb-6 animate-float" />
                        ) : (
                            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                        )}

                        <h2 className="text-3xl font-display font-bold mb-4">
                            {passed ? 'Certificazione Superata!' : 'Ancora un Passo...'}
                        </h2>

                        <div className="text-6xl font-bold mb-2">
                            <span className={passed ? 'text-lux-cyan' : 'text-red-400'}>{score}%</span>
                        </div>
                        <p className="text-gray-400 mb-6">
                            {correctCount} / {quiz.questions.length} risposte corrette
                        </p>

                        {passed ? (
                            <>
                                <p className="text-lg text-gray-300 mb-8">
                                    Congratulazioni, {user?.name || "Eroe"}! Hai dimostrato padronanza dei concetti chiave.
                                    Il Diploma Magistrale ti aspetta.
                                </p>
                                <button
                                    onClick={handleFinish}
                                    className="px-8 py-4 bg-gradient-to-r from-lux-cyan to-blue-500 text-black font-bold uppercase tracking-wider rounded hover:brightness-110 transition-all"
                                >
                                    Reclama il Diploma
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-lg text-gray-300 mb-8">
                                    Punteggio necessario: {quiz.passingScore}%. Rivedi i moduli e ritenta quando sei pronto.
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={onClose}
                                        className="px-8 py-3 bg-lux-navy border border-lux-gold/30 text-white font-bold uppercase tracking-wider rounded hover:border-lux-gold transition-all"
                                    >
                                        Rivedi Contenuti
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowResults(false);
                                            setCurrentQuestion(0);
                                            setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
                                        }}
                                        className="px-8 py-3 bg-lux-gold text-black font-bold uppercase tracking-wider rounded hover:brightness-110 transition-all"
                                    >
                                        Ritenta Quiz
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Detailed Results */}
                        <div className="mt-8 pt-8 border-t border-gray-800 text-left">
                            <h3 className="text-lg font-bold mb-4">Riepilogo Risposte:</h3>
                            {quiz.questions.map((q, index) => {
                                const isCorrect = selectedAnswers[index] === q.correctAnswer;
                                return (
                                    <div key={q.id} className={`mb-4 p-4 rounded border ${isCorrect ? 'border-lux-cyan/30 bg-lux-cyan/5' : 'border-red-500/30 bg-red-900/5'}`}>
                                        <div className="flex items-start gap-3">
                                            {isCorrect ? (
                                                <CheckCircle className="w-5 h-5 text-lux-cyan flex-shrink-0 mt-1" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                                            )}
                                            <div className="flex-1">
                                                <p className="text-sm font-medium mb-2">{index + 1}. {q.question}</p>
                                                <p className="text-xs text-gray-500">
                                                    La tua risposta: <span className={isCorrect ? 'text-lux-cyan' : 'text-red-400'}>{q.options[selectedAnswers[index]]}</span>
                                                </p>
                                                {!isCorrect && (
                                                    <p className="text-xs text-lux-cyan mt-1">
                                                        Risposta corretta: {q.options[q.correctAnswer]}
                                                    </p>
                                                )}
                                                {q.explanation && (
                                                    <p className="text-xs text-gray-400 mt-2 italic">{q.explanation}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const question = quiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

    return (
        <div className="fixed inset-0 z-50 bg-lux-black/95 text-gray-200 flex items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-lux-black/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-lux-gold/20">

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Domanda {currentQuestion + 1} di {quiz.questions.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-lux-gold to-lux-cyan transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-gradient-to-b from-lux-navy/90 to-lux-black border border-lux-gold/20 rounded-lg p-8 mb-6">
                    <h3 className="text-2xl font-display font-bold text-white mb-6">
                        {question.question}
                    </h3>

                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedAnswers[currentQuestion] === index
                                    ? 'border-lux-gold bg-lux-gold/10 text-white'
                                    : 'border-gray-700 hover:border-lux-gold/50 bg-transparent text-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedAnswers[currentQuestion] === index
                                        ? 'border-lux-gold bg-lux-gold'
                                        : 'border-gray-600'
                                        }`}>
                                        {selectedAnswers[currentQuestion] === index && (
                                            <div className="w-3 h-3 rounded-full bg-lux-black"></div>
                                        )}
                                    </div>
                                    <span>{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className="px-6 py-3 bg-lux-navy border border-lux-gold/30 text-white font-bold uppercase tracking-wider rounded hover:border-lux-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Indietro
                    </button>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-300 text-sm"
                    >
                        Esci dal Quiz
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={selectedAnswers[currentQuestion] === -1}
                        className="px-6 py-3 bg-gradient-to-r from-lux-gold to-lux-goldDark text-black font-bold uppercase tracking-wider rounded hover:brightness-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {currentQuestion === quiz.questions.length - 1 ? 'Completa' : 'Avanti'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
