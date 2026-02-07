import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';

// --- ASSETS & CONFIG ---
const AUDIO_TRACK_URL = "https://cdn1.suno.ai/d32be224-e48d-405b-9c2a-1fb21bfaf9d6.mp3";
const UI_REFERENCE_IMG = "/assets/manifesto/ui_reference.png";

// --- TYPES ---
type Theme = 'void' | 'chaos' | 'signal' | 'architect' | 'structure' | 'ai' | 'closing';

interface ScriptItem {
    id: number;
    text: string | React.ReactNode;
    duration: number; // ms
    theme: Theme;
    style?: string;
    subText?: string;
}

// --- SCRIPT SEQUENCE (DIRECTOR'S CUT 2.0) ---
const SCRIPT_SEQUENCE: ScriptItem[] = [
    // SCENE 1: IL VUOTO (The Void)
    // "Il silenzio non è vuoto."
    {
        id: 1,
        text: "Il silenzio non è vuoto.",
        duration: 5000,
        theme: "void",
        style: "text-white text-3xl md:text-5xl font-serif italic tracking-widest opacity-90"
    },

    // SCENE 2: IL RUMORE (The Noise)
    // "Laggiù... è solo rumore di fondo."
    {
        id: 2,
        text: "Laggiù...",
        duration: 2000,
        theme: "chaos",
        style: "text-gray-300 text-6xl font-black uppercase tracking-tighter glitch-text"
    },
    {
        id: 3,
        text: "È SOLO RUMORE DI FONDO.",
        duration: 4000,
        theme: "chaos",
        style: "text-red-500 text-5xl md:text-7xl font-black uppercase tracking-tighter mix-blend-difference"
    },

    // SCENE 3: IL SEGNALE (The Signal)
    // "In un mondo che urla... il Segnale vince sempre."
    {
        id: 4,
        text: "In un mondo che urla...",
        duration: 3000,
        theme: "signal",
        style: "text-white text-2xl font-light tracking-[0.5em]"
    },
    {
        id: 5,
        text: "IL SEGNALE VINCE SEMPRE.",
        duration: 4000,
        theme: "signal",
        style: "text-yellow-400 text-4xl md:text-6xl font-serif font-bold tracking-widest text-glow-gold"
    },

    // SCENE 4: L'ARCHITETTO (The Architect)
    // "Non sono qui per insegnarti a parlare. Parlare è gratis."
    {
        id: 6,
        text: "Non sono qui per insegnarti a parlare.",
        duration: 3000,
        theme: "architect",
        style: "text-white text-xl md:text-3xl font-light tracking-wide"
    },
    {
        id: 7,
        text: "PARLARE È GRATIS.",
        duration: 3000,
        theme: "architect",
        style: "text-white text-5xl md:text-7xl font-black tracking-tighter border-b-4 border-white"
    },
    {
        id: 8,
        text: "Io installo protocolli di autorità.",
        duration: 4000,
        theme: "architect",
        style: "text-blue-400 text-2xl font-mono tracking-widest"
    },

    // SCENE 5: LA STRUTTURA (The Structure)
    // "Neuro-Narrativa. Ingegneria Acustica. Dominio."
    {
        id: 9,
        text: <div className="flex flex-col gap-4">
            <span>NEURO-NARRATIVA.</span>
            <span className="opacity-50">INGEGNERIA ACUSTICA.</span>
            <span className="opacity-30">DOMINIO.</span>
        </div>,
        duration: 4000,
        theme: "structure",
        style: "text-yellow-500 text-4xl md:text-6xl font-black tracking-tighter leading-tight"
    },
    {
        id: 10,
        text: "La tua voce è l'unico algoritmo che Google non può copiare.",
        duration: 4000,
        theme: "structure",
        style: "text-white text-xl md:text-3xl font-serif italic max-w-2xl leading-relaxed"
    },

    // SCENE 6: L'INTEGRAZIONE AI (AI Integration)
    // "Benvenuto nell'Architettura. Dove l'Umano incontra la Macchina."
    {
        id: 11,
        text: "Benvenuto nell'Architettura.",
        duration: 3000,
        theme: "ai",
        style: "text-blue-500 text-4xl font-mono animate-pulse"
    },
    {
        id: 12,
        text: "Dove la Storia diventa Impero.",
        duration: 4000,
        theme: "ai",
        style: "text-white text-5xl font-serif font-bold tracking-widest drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]"
    },

    // SCENE 7: LA CHIUSURA (Closing)
    {
        id: 13,
        text: "Io sono Michael Jara.",
        duration: 2500,
        theme: "closing",
        style: "text-white text-xl tracking-[0.5em] uppercase"
    },
    {
        id: 14,
        text: "ALZIAMO LA FREQUENZA.",
        duration: 3000,
        theme: "closing",
        style: "text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 text-5xl md:text-7xl font-black tracking-tighter"
    },
];

export const ManifestoPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [started, setStarted] = useState(false);
    const [currentTheme, setCurrentTheme] = useState<Theme>('void');
    const audioRef = useRef<HTMLAudioElement>(null);

    // Audio Control & Sequence Logic
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
            setCurrentTheme('closing');
        }
    }, [currentIndex, started]);

    const handleStart = () => {
        setStarted(true);
        if (audioRef.current) {
            audioRef.current.volume = 0.8;
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.error("Audio Playback Failed", e));
        }
    };

    // --- VISUAL THEME RENDERERS ---

    // Scene 3: Waveform Effect
    const renderWaveform = () => (
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
            <div className="flex gap-1 items-center h-64">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-2 bg-yellow-500 rounded-full"
                        animate={{ height: ["20%", "80%", "20%"] }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.05,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>
        </div>
    );

    // Scene 5: Matrix/Grid Effect
    const renderGrid = () => (
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>
            <motion.div
                className="absolute inset-0 bg-blue-900/10"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
            />
        </div>
    );

    // Scene 6: AI/Code Effect
    const renderAI = () => (
        <div className="absolute inset-0 z-0 overflow-hidden">
            {/* Background Screenshot */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30 saturate-0 scale-110"
                style={{ backgroundImage: `url(${UI_REFERENCE_IMG})` }}
            ></div>
            <div className="absolute inset-0 bg-blue-950/80 mix-blend-multiply"></div>

            {/* Floating Code Snippets */}
            <div className="absolute top-10 left-10 text-blue-400 font-mono text-xs opacity-50">
                <p>{`> ANALYZING VOCAL FREQUENCY...`}</p>
                <p>{`> DETECTING LIMBIC RESONANCE...`}</p>
                <p>{`> AUTHORITY_PROTOCOL_INITIATED`}</p>
            </div>
        </div>
    );

    // Background Switcher
    const renderBackground = () => {
        switch (currentTheme) {
            case 'void':
                return <div className="absolute inset-0 bg-black transition-colors duration-1000"></div>;
            case 'chaos':
                return (
                    <div className="absolute inset-0 bg-black overflow-hidden">
                        <div className="absolute inset-0 opacity-20 mix-blend-overlay animate-pulse" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
                        <motion.div className="absolute top-0 w-full h-[2px] bg-white opacity-20" animate={{ top: ["0%", "100%"] }} transition={{ duration: 0.2, repeat: Infinity }} />
                    </div>
                );
            case 'signal':
                return (
                    <div className="absolute inset-0 bg-black">
                        {renderWaveform()}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/20 via-black to-black"></div>
                    </div>
                );
            case 'architect':
                return (
                    <div className="absolute inset-0 bg-black">
                        {/* Spotlight Effect */}
                        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,_rgba(255,255,255,0.1),transparent_60%)]"></div>
                    </div>
                );
            case 'structure':
                return (
                    <div className="absolute inset-0 bg-black">
                        {renderGrid()}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
                    </div>
                );
            case 'ai':
                return renderAI();
            case 'closing':
            case 'ascension':
                return (
                    <div className="absolute inset-0 bg-black">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-600/20 blur-[100px] rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-yellow-500/10 via-black to-black"></div>
                        {/* Gold Particles */}
                        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1' fill='%23FFD700'/%3E%3Ccircle cx='50' cy='80' r='1.5' fill='%23FFD700'/%3E%3Ccircle cx='150' cy='30' r='1' fill='%23FFD700'/%3E%3C/svg%3E")`, backgroundSize: '100px 100px' }}></div>
                    </div>
                );
            default:
                return <div className="absolute inset-0 bg-black"></div>;
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden cursor-none font-sans select-none">
            {/* Audio Track */}
            <audio ref={audioRef} loop>
                <source src={AUDIO_TRACK_URL} type="audio/mpeg" />
            </audio>

            {/* Dynamic Background */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentTheme}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 z-0"
                >
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
                        className="group px-12 py-5 bg-transparent border border-yellow-500/30 text-yellow-500 text-xl tracking-[0.5em] font-light hover:bg-yellow-500 hover:text-black transition-all duration-500 rounded-sm uppercase backdrop-blur-sm"
                    >
                        <span className="group-hover:tracking-[0.7em] transition-all duration-500">Inizia il Rituale</span>
                    </motion.button>
                </div>
            )}

            {/* Sequence Render */}
            <div className="z-10 relative max-w-6xl px-8 text-center min-h-[400px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {started && !isFinished && currentIndex < SCRIPT_SEQUENCE.length && (
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', y: 20 }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
                            exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)', y: -20 }}
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
                        <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-400 to-yellow-800 mb-8 tracking-tighter drop-shadow-[0_0_50px_rgba(234,179,8,0.3)]">
                            VOX LUX
                        </h1>
                        <p className="text-yellow-500/60 tracking-[0.5em] uppercase mb-12 text-sm font-serif">
                            The Architect's Protocol
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/dashboard')}
                            className="group relative px-10 py-5 bg-white text-black font-black tracking-widest uppercase text-sm overflow-hidden cursor-pointer pointer-events-auto shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                ENTER THE VORTEX <ArrowRight size={18} />
                            </span>
                            <div className="absolute inset-0 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 z-0"></div>
                        </motion.button>
                    </motion.div>
                )}
            </div>

            {/* Cinematic Overlay (Always on top) */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_120%)]"></div>
        </div>
    );
};
