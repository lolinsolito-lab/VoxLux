import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';

// Refined Script Data with Themes
const SCRIPT_SEQUENCE = [
    // PHASE 1: THE NOISE (Chaos, Fast, Glitchy)
    {
        text: "Senti questo rumore?",
        duration: 4000,
        theme: "chaos",
        style: "text-white text-xl italic tracking-widest opacity-80"
    },
    {
        text: "Tutti urlano.",
        duration: 3000,
        theme: "chaos",
        style: "text-gray-300 text-3xl font-bold tracking-normal glitch-effect"
    },
    {
        text: "Nessuno ascolta.",
        duration: 3000,
        theme: "chaos",
        style: "text-gray-400 text-3xl font-bold tracking-normal glitch-effect delay-100"
    },

    // PHASE 2: THE SILENCE (Void, Deep, Calm)
    {
        text: "Fermati.",
        duration: 2000,
        theme: "void",
        style: "text-white text-6xl font-black uppercase tracking-widest"
    },
    {
        text: "Il vero potere non alza la voce.",
        duration: 4000,
        theme: "void",
        style: "text-yellow-500/80 text-2xl font-serif italic"
    },
    {
        text: "Sussurra.",
        duration: 3000,
        theme: "void",
        style: "text-white text-4xl font-light tracking-[0.3em] backdrop-blur-sm"
    },

    // PHASE 3: THE MATRIX (Structure, Grid, Logic)
    {
        text: "C'è un codice dietro il caos.",
        duration: 4000,
        theme: "matrix",
        style: "text-green-400 text-xl font-mono tracking-widest typing-effect"
    },
    {
        text: "STORYTELLING",
        duration: 1000,
        theme: "matrix",
        style: "text-white text-5xl font-black tracking-tighter"
    },
    {
        text: "PSICOLOGIA",
        duration: 1000,
        theme: "matrix",
        style: "text-white text-5xl font-black tracking-tighter"
    },
    {
        text: "STRATEGIA",
        duration: 2000,
        theme: "matrix",
        style: "text-white text-5xl font-black tracking-tighter"
    },

    // PHASE 4: ASCENSION (Gold, Divine, Power)
    {
        text: "Benvenuto nell'Elite.",
        duration: 4000,
        theme: "ascension",
        style: "text-yellow-400 text-4xl font-serif font-bold tracking-widest border-b border-yellow-500 pb-2 shadow-glow"
    },
    {
        text: "VOX LUX",
        duration: 5000,
        theme: "ascension",
        style: "text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-200 to-yellow-600 text-8xl font-black tracking-tighter drop-shadow-2xl"
    },
];

export const ManifestoPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [started, setStarted] = useState(false);
    const [currentTheme, setCurrentTheme] = useState('void');

    useEffect(() => {
        if (!started) return;

        if (currentIndex < SCRIPT_SEQUENCE.length) {
            const item = SCRIPT_SEQUENCE[currentIndex];
            setCurrentTheme(item.theme);

            const timer = setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
            }, item.duration);
            return () => clearTimeout(timer);
        } else {
            setIsFinished(true);
            setCurrentTheme('ascension');
        }
    }, [currentIndex, started]);

    const handleStart = () => {
        setStarted(true);
        // Force audio play
        const audio = document.querySelector('audio');
        if (audio) {
            audio.volume = 1.0;
            audio.currentTime = 0;
            audio.play().catch(e => console.log("Audio autoplay prevented", e));
        }
    };

    // Dynamic Background Renderer
    const renderBackground = () => {
        switch (currentTheme) {
            case 'chaos':
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-0 bg-black"
                    >
                        {/* Static Noise Overlay */}
                        <div className="absolute inset-0 opacity-20 mix-blend-overlay animate-pulse" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-white/10 animate-bounce"></div>
                    </motion.div>
                );
            case 'matrix':
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-0 bg-black"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black"></div>
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 0, .3) 25%, rgba(0, 255, 0, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .3) 75%, rgba(0, 255, 0, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, .3) 25%, rgba(0, 255, 0, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .3) 75%, rgba(0, 255, 0, .3) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }}></div>
                    </motion.div>
                );
            case 'ascension':
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-0 bg-black"
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-600/20 blur-[100px] rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-yellow-500/10 via-black to-black"></div>
                        {/* Gold Particles (CSS) */}
                        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1' fill='%23FFD700'/%3E%3Ccircle cx='50' cy='80' r='1.5' fill='%23FFD700'/%3E%3Ccircle cx='150' cy='30' r='1' fill='%23FFD700'/%3E%3C/svg%3E")`, backgroundSize: '100px 100px' }}></div>
                    </motion.div>
                );
            case 'void':
            default:
                return <div className="absolute inset-0 z-0 bg-black transition-colors duration-1000"></div>;
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden cursor-none font-sans">
            {/* Dynamic Background */}
            <AnimatePresence mode="wait">
                <motion.div key={currentTheme} className="absolute inset-0 z-0">
                    {renderBackground()}
                </motion.div>
            </AnimatePresence>

            {/* Start Screen */}
            {!started && (
                <div className="z-50 text-center cursor-auto relative">
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(234,179,8,0.3)" }}
                        onClick={handleStart}
                        className="px-12 py-4 bg-transparent border border-yellow-500/50 text-yellow-500 text-xl tracking-[0.5em] font-light hover:bg-yellow-500 hover:text-black transition-all duration-500 rounded-sm uppercase"
                    >
                        Inizia il Rituale
                    </motion.button>
                </div>
            )}

            {/* Sequence Render */}
            <div className="z-10 relative max-w-5xl px-8 text-center min-h-[400px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {started && !isFinished && currentIndex < SCRIPT_SEQUENCE.length && (
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Elegant easing
                            className={SCRIPT_SEQUENCE[currentIndex].style}
                        >
                            {SCRIPT_SEQUENCE[currentIndex].text}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Final State */}
                {isFinished && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2 }}
                        className="text-center"
                    >
                        <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-400 to-yellow-800 mb-8 tracking-tighter drop-shadow-[0_0_50px_rgba(234,179,8,0.3)]">
                            VOX LUX
                        </h1>
                        <p className="text-yellow-500/60 tracking-[0.5em] uppercase mb-12 text-sm font-serif">
                            L'Arte del Silenzio
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/dashboard')}
                            className="group relative px-10 py-5 bg-white text-black font-black tracking-widest uppercase text-sm overflow-hidden cursor-pointer pointer-events-auto shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Enter the Vortex <ArrowRight size={18} />
                            </span>
                            <div className="absolute inset-0 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 z-0"></div>
                        </motion.button>
                    </motion.div>
                )}
            </div>

            {/* Cinematic Grain Overlay (Always on top) */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
        </div>
    );
};
