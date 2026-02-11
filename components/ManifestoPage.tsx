import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Volume2, VolumeX, Play, Pause } from 'lucide-react';

// --- ASSETS & CONFIG ---
// Local Audio Track (Bypasses CSP issues)
const AUDIO_TRACK_URL = "/assets/manifesto/manifesto_track.mp3";
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
    const [isPaused, setIsPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Audio & Sequence Logic
    useEffect(() => {
        if (!started || isPaused) return;

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
    }, [currentIndex, started, isPaused]);

    // Handle Play/Pause
    const togglePlay = () => {
        if (audioRef.current) {
            if (isPaused) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
            setIsPaused(!isPaused);
        }
    };

    // Handle Mute
    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleStart = () => {
        setStarted(true);
        if (audioRef.current) {
            audioRef.current.volume = 1.0;
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.error("Audio Playback Failed", e));
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden cursor-default font-sans select-none">
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
                        animate={{ opacity: 0.6, scale: 1 }} // Increased opacity
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0 z-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${currentImage})` }}
                    />
                )}
            </AnimatePresence>

            {/* Base Gradient Overlay for Readability */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-black/40 to-black/80 pointer-events-none"></div>

            {/* Controls (Bottom Right) */}
            {started && !isFinished && (
                <div className="absolute bottom-8 right-8 z-[60] flex items-center gap-4 text-yellow-500/50 hover:text-yellow-500 transition-colors duration-300">
                    <button
                        onClick={togglePlay}
                        className="p-2 hover:bg-white/10 rounded-full transition-all"
                    >
                        {isPaused ? <Play size={24} /> : <Pause size={24} />}
                    </button>
                    <button
                        onClick={toggleMute}
                        className="p-2 hover:bg-white/10 rounded-full transition-all"
                    >
                        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                    <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-yellow-500"
                            initial={{ width: "100%" }}
                            animate={{ width: isMuted ? "0%" : "100%" }}
                        />
                    </div>
                </div>
            )}

            {/* Start Screen - ABSOLUTE CENTERED */}
            {!started && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-12 bg-black/20 backdrop-blur-sm">
                    <motion.img
                        src="/logo.png"
                        alt="VOX AUREA Logo"
                        className="w-48 md:w-64 opacity-90 drop-shadow-[0_0_25px_rgba(234,179,8,0.5)]"
                        initial={{ opacity: 0, scale: 0.8, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(234,179,8,0.4)", textShadow: "0 0 10px rgba(234,179,8,0.8)" }}
                        onClick={handleStart}
                        className="group px-14 py-6 bg-transparent border border-yellow-500/40 text-yellow-500 text-xl tracking-[0.6em] font-light hover:bg-yellow-500 hover:text-black transition-all duration-500 rounded-sm uppercase"
                    >
                        <span className="group-hover:tracking-[0.8em] transition-all duration-500">Inizia il Rituale</span>
                    </motion.button>
                </div>
            )}

            {/* Narrative Sequence Render */}
            <div className="z-20 relative max-w-7xl px-8 text-center min-h-[500px] flex items-center justify-center">
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
                            VOX AUREA
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
            <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
        </div>
    );
};
