import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';

// Script Data from manifesto_script.md
const SCRIPT_SEQUENCE = [
    { text: "In un mondo che urla...", duration: 4000, style: "text-white text-xl italic tracking-widest" },
    { text: "...chi sa sussurrare diventa Re.", duration: 5000, style: "text-yellow-500 text-4xl font-serif font-black tracking-widest uppercase" },
    { text: "Non vendo corsi.", duration: 3000, style: "text-gray-300 text-2xl font-bold tracking-wide" },
    { text: "Non vendo strategie.", duration: 3000, style: "text-gray-300 text-2xl font-bold tracking-wide" },
    { text: "Vendo l'unica cosa che il denaro non può comprare...", duration: 4000, style: "text-white text-2xl font-light italic" },
    { text: "AUTORITÀ.", duration: 4000, style: "text-yellow-500 text-6xl font-black tracking-[0.2em] shadow-lg shadow-yellow-500/20" },
    { text: "STORYTELLING.", duration: 1500, style: "text-white text-5xl font-black tracking-tighter" },
    { text: "PSICOLOGIA.", duration: 1500, style: "text-white text-5xl font-black tracking-tighter" },
    { text: "DOMINIO.", duration: 3000, style: "text-white text-7xl font-black tracking-tighter text-red-500" },
    { text: "La tua voce è un'arma.", duration: 4000, style: "text-gray-400 text-3xl font-serif" },
    { text: "Benvenuto nella Matrice Vox Lux.", duration: 4000, style: "text-yellow-500 text-3xl font-bold uppercase tracking-widest border-b border-yellow-500 pb-2" },
    { text: "Qui impari a comandare.", duration: 4000, style: "text-white text-4xl font-black italic" },
    { text: "ELEVATE YOUR FREQUENCY.", duration: 5000, style: "text-yellow-100 text-5xl font-serif font-bold tracking-[0.5em] text-center" },
];

export const ManifestoPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [started, setStarted] = useState(false);

    // Audio Ref (Assuming BackgroundMusic context controls global audio, 
    // but for a standalone recording page we might want direct control or rely on the user clicking 'Start')

    useEffect(() => {
        if (!started) return;

        if (currentIndex < SCRIPT_SEQUENCE.length) {
            const timer = setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
            }, SCRIPT_SEQUENCE[currentIndex].duration);
            return () => clearTimeout(timer);
        } else {
            setIsFinished(true);
        }
    }, [currentIndex, started]);

    const handleStart = () => {
        setStarted(true);
        // Dispatch event to start music if not playing, or relying on global BackgroundMusic
        const audioEvent = new CustomEvent('force-play-music');
        window.dispatchEvent(audioEvent);
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden cursor-none">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900/40 via-black to-black opacity-80 z-0"></div>

            {/* Start Screen */}
            {!started && (
                <div className="z-50 text-center cursor-auto">
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
            <div className="z-10 relative max-w-4xl px-8 text-center min-h-[300px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {started && !isFinished && currentIndex < SCRIPT_SEQUENCE.length && (
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -20, filter: 'blur(10px)', scale: 1.1 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
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
                        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-700 mb-8 tracking-tighter">
                            VOX LUX
                        </h1>
                        <p className="text-gray-400 tracking-widest uppercase mb-12 text-sm">
                            Strategy • Psychology • Dominance
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/dashboard')}
                            className="group relative px-8 py-4 bg-white text-black font-bold tracking-widest uppercase text-sm overflow-hidden cursor-pointer pointer-events-auto"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Enter the Vortex <ArrowRight size={16} />
                            </span>
                            <div className="absolute inset-0 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 z-0"></div>
                        </motion.button>
                    </motion.div>
                )}
            </div>

            {/* Cinematic Grain Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
        </div>
    );
};
