import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// --- ASSETS & CONFIG ---
const AUDIO_TRACK_URL = "https://cdn1.suno.ai/d32be224-e48d-405b-9c2a-1fb21bfaf9d6.mp3";
const IMG = {
    chaos: "/assets/manifesto/chaos_bg.png",
    void: "/assets/manifesto/void_bg.png",
    ascension: "/assets/manifesto/ascension_bg.png",
    dashboard: "/assets/manifesto/dashboard_ui.webp",
    map: "/assets/manifesto/storytelling_map.png"
};

// --- TYPES ---
type Theme = 'intro' | 'noise' | 'signal' | 'architect' | 'structure' | 'integration' | 'climax';

interface ScriptItem {
    id: number;
    text: React.ReactNode;
    duration: number; // ms
    theme: Theme;
    style?: string;
    bgImage?: string; // Optional specific background image override
}

// --- SCRIPT SEQUENCE (MULTIMEDIA STORYTELLING V3.0) ---
const SCRIPT_SEQUENCE: ScriptItem[] = [
    // SCENE 1: IL VUOTO (Intro)
    {
        id: 1,
        text: "Ascolta...",
        duration: 3000,
        theme: "intro",
        style: "text-white text-4xl font-light tracking-[0.2em] opacity-80"
    },
    {
        id: 2,
        text: "Il silenzio non è mai vuoto",
        duration: 4000,
        theme: "intro",
        style: "text-white text-5xl font-serif italic tracking-wide"
    },

    // SCENE 2: IL RUMORE (Chaos) - Uses Chaos BG
    {
        id: 3,
        text: "È UN OCEANO DI RUMORE",
        duration: 2500,
        theme: "noise",
        bgImage: IMG.chaos,
        style: "text-gray-200 text-6xl font-black uppercase tracking-tighter glitch-effect mix-blend-difference"
    },
    {
        id: 4,
        text: "Tutti urlano ma nessuno viene ascoltato",
        duration: 3500,
        theme: "noise",
        style: "text-red-500 text-3xl font-bold uppercase tracking-widest bg-black/50 p-4"
    },

    // SCENE 3: IL SEGNALE (Signal) - Uses Void BG
    {
        id: 5,
        text: "Ma in questo caos...",
        duration: 2500,
        theme: "signal",
        bgImage: IMG.void,
        style: "text-white text-2xl font-light tracking-[0.5em]"
    },
    {
        id: 6,
        text: "IL SEGNALE VINCE SEMPRE",
        duration: 4000,
        theme: "signal",
        style: "text-yellow-400 text-5xl md:text-7xl font-serif font-black tracking-widest text-glow-gold"
    },

    // SCENE 4: L'ARCHITETTO (Architect) - No BG change (Focus on Text)
    {
        id: 7,
        text: "Non vendo parole",
        duration: 2500,
        theme: "architect",
        style: "text-white text-4xl font-light tracking-wide border-b border-white/30 pb-2"
    },
    {
        id: 8,
        text: "Io installo autorità",
        duration: 3500,
        theme: "architect",
        style: "text-blue-300 text-5xl font-mono tracking-tighter"
    },

    // SCENE 5: LA STRUTTURA (Structure) - Uses Storytelling Map
    {
        id: 9,
        text: "Neuro-Narrativa",
        duration: 3000,
        theme: "structure",
        bgImage: IMG.map,
        style: "text-yellow-500 text-6xl font-black tracking-tighter drop-shadow-2xl"
    },
    {
        id: 10,
        text: "Una mappa per la mente del tuo cliente",
        duration: 4000,
        theme: "structure",
        style: "text-white text-3xl font-serif italic bg-black/60 px-6 py-2 rounded-sm backdrop-blur-md"
    },

    // SCENE 6: INTEGRAZIONE (Integration) - Uses Dashboard UI
    {
        id: 11,
        text: "Dove il Metodo incontra la Macchina",
        duration: 3500,
        theme: "integration",
        bgImage: IMG.dashboard,
        style: "text-blue-400 text-4xl font-mono tracking-widest bg-black/80 px-4 py-2"
    },
    {
        id: 12,
        text: "Dominio Totale",
        duration: 4000,
        theme: "integration",
        style: "text-white text-7xl font-black uppercase tracking-tighter mix-blend-overlay"
    },

    // SCENE 7: CLIMAX (Ascension) - Uses Ascension BG
    {
        id: 13,
        text: "Io sono Michael Jara",
        duration: 3000,
        theme: "climax",
        bgImage: IMG.ascension,
        style: "text-yellow-200 text-2xl tracking-[0.5em] uppercase font-light"
    },
    {
        id: 14,
        text: "ALZIAMO LA FREQUENZA",
        duration: 4000,
        theme: "climax",
        style: "text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-300 to-yellow-600 text-6xl md:text-8xl font-black tracking-tighter drop-shadow-[0_0_30px_rgba(234,179,8,0.6)]"
    },
];

export const ManifestoPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [started, setStarted] = useState(false);
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Audio & Sequence Loic
    useEffect(() => {
        if (!started) return;

        if (currentIndex < SCRIPT_SEQUENCE.length) {
            const item = SCRIPT_SEQUENCE[currentIndex];

            // Image Transition Logic
            if (item.bgImage) {
                setCurrentImage(item.bgImage);
            }

            const timer = setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
            }, item.duration);
            return () => clearTimeout(timer);
        } else {
            setIsFinished(true);
        }
    }, [currentIndex, started]);

    const handleStart = () => {
        setStarted(true);
        if (audioRef.current) {
            audioRef.current.volume = 1.0;
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.error("Audio Playback Failed", e));
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden cursor-none font-sans select-none">
            {/* Audio Track */}
            <audio ref={audioRef} loop>
                <source src={AUDIO_TRACK_URL} type="audio/mpeg" />
            </audio>

            {/* Dynamic Background Images with Smooth Transitions */}
            <AnimatePresence mode="popLayout">
                {currentImage && (
                    <motion.div
                        key={currentImage}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 0.4, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0 z-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${currentImage})` }}
                    />
                )}
            </AnimatePresence>

            {/* Base Gradient Overlay for Readability */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black via-black/50 to-black pointer-events-none"></div>

            {/* Start Screen */}
            {!started && (
                <div className="z-50 text-center cursor-auto relative">
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(234,179,8,0.3)" }}
                        onClick={handleStart}
                        className="group px-12 py-5 bg-transparent border border-yellow-500/30 text-yellow-500 text-xl tracking-[0.5em] font-light hover:bg-yellow-500 hover:text-black transition-all duration-500 rounded-sm uppercase backdrop-blur-sm"
                    >
                        <span className="group-hover:tracking-[0.7em] transition-all duration-500">Inizia il Rituale</span>
                    </motion.button>
                </div>
            )}

            {/* Narrative Sequence Render */}
            <div className="z-10 relative max-w-7xl px-8 text-center min-h-[500px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {started && !isFinished && currentIndex < SCRIPT_SEQUENCE.length && (
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -30, filter: 'blur(10px)', scale: 1.1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
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
                        <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-200 to-yellow-600 mb-6 tracking-tighter drop-shadow-[0_0_60px_rgba(234,179,8,0.4)]">
                            VOX LUX
                        </h1>
                        <p className="text-yellow-500/80 tracking-[0.6em] uppercase mb-12 text-sm font-serif border-t border-b border-yellow-500/30 py-4 inline-block">
                            Il Protocollo Sovrano
                        </p>

                        <div className="block mt-8">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/dashboard')}
                                className="group relative px-10 py-5 bg-white text-black font-black tracking-widest uppercase text-sm overflow-hidden cursor-pointer pointer-events-auto shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:shadow-[0_0_60px_rgba(234,179,8,0.5)]"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    ENTER THE VORTEX <ArrowRight size={18} />
                                </span>
                                <div className="absolute inset-0 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 z-0"></div>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Cinematic Noise & Vignette Overlay (Always on top) */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
        </div>
    );
};
