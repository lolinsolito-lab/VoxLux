import React, { useEffect, useState, useMemo } from 'react';
import { COURSES, Mastermind } from '../services/courseData';
import { PODCAST_THEMES } from '../services/themeRegistry';
import { useAudioSystem } from '../hooks/useAudioSystem';
import { Mic, Play, ArrowLeft, Waves, Check, Sparkles } from 'lucide-react';
import { PodcastAtmosphere } from './PodcastAtmosphere';

interface PodcastCinematicHubProps {
    courseId: string;
    onSelectWorld: (worldId: string) => void;
    onBack: () => void;
    completedModules: Set<string>;
}

// ECLIPSE INTERFERENCE KEYFRAMES (TOTAL BLACKOUT)
const ECLIPSE_STYLE = `
@keyframes eclipse-interference {
    0%, 30% { opacity: 1; filter: brightness(1) drop-shadow(0 0 10px rgba(251,191,36,0.5)); } /* Sun Phase: Glowing */
    35%, 65% { 
        background-color: #000000 !important; 
        border-color: #000000 !important; 
        color: transparent !important; 
        box-shadow: none !important;
        opacity: 0.2; /* Fade out the element itself significantly */
    }
    70%, 100% { opacity: 1; filter: brightness(1) drop-shadow(0 0 10px rgba(251,191,36,0.5)); }
}
`;

export const PodcastCinematicHub: React.FC<PodcastCinematicHubProps> = ({ courseId, onSelectWorld, onBack, completedModules }) => {
    const { playSound } = useAudioSystem();
    const course = COURSES[courseId] || COURSES['matrice-2'];
    const [hoveredNode, setHoveredNode] = useState<number | null>(null);

    useEffect(() => {
        playSound('ambient_transition');
    }, [playSound]);

    // Stars and Atmosphere moved to <PodcastAtmosphere />

    // ORBIT CONFIGURATION
    // 10 distinct concentric orbits. 
    // We memoize the orbit visuals so they don't reset on hover rerenders
    const orbitVisuals = useMemo(() => {
        return Array.from({ length: 10 }, (_, i) => {
            // Direction: Unified "Vortex" Flow (Real Solar System Physics)
            // All planets orbit in the same direction (Prograde).
            const isReverse = false; // Uniform direction
            // Duration: Slower, Majestic, "Real Solar System" Feel
            // Old: 15 + (i * 2) -> New: 45 + (i * 6) = 45s (Inner) to 99s (Outer)
            const duration = 45 + (i * 6) + (Math.random() * 10);
            // Random start position
            const delay = -(Math.random() * 50);

            // ORGANIC PULSE: Randomize the 'Breathing' light timing so they don't sync up
            const pulseDelay = -(Math.random() * 5); // Start at different times
            const pulseDuration = 2 + Math.random() * 3; // Breathe at different speeds (2s-5s)

            return {
                radius: 18 + (i * 4),
                nodes: [i],
                isReverse,
                duration,
                delay,
                pulseDelay,
                pulseDuration
            };
        });
    }, []);

    const isWorldComplete = (mm: Mastermind) => {
        if (!mm.modules || mm.modules.length === 0) return false;
        return mm.modules.every(m => completedModules.has(m.id));
    };

    return (
        <div className="fixed inset-0 bg-black overflow-hidden font-sans select-none flex items-center justify-center">

            {/* 0. DEEP SPACE & ATMOSPHERE - Memoized Component */}
            <PodcastAtmosphere />
            <style>{ECLIPSE_STYLE}</style>



            {/* 2. HERO OVERLAY */}
            <div className="absolute inset-0 z-30 pointer-events-none p-4 md:p-8 flex flex-col justify-between">

                {/* HEADER ROW */}
                <div className="flex justify-between items-start pointer-events-auto">
                    {/* TOP LEFT: Back Button */}
                    <button
                        onClick={onBack}
                        className="text-amber-100/60 hover:text-white flex items-center gap-2 group transition-colors"
                        onMouseEnter={() => playSound('hover')}
                    >
                        <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        <span className="uppercase tracking-[0.2em] text-xs font-bold hidden md:inline">Torna alla Lista</span>
                    </button>

                    {/* TOP RIGHT: Title (Matching Storytelling Hub) */}
                    <div className="text-right animate-[slideInRight_1s_ease-out]">
                        <h1 className="text-3xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-white drop-shadow-[0_0_30px_rgba(251,191,36,0.4)]">
                            PODCAST <br /> MASTERMIND
                        </h1>
                        <p className="text-amber-100/60 mt-2 text-xs md:text-base border-r-2 border-amber-200/30 pr-4 py-1 italic">
                            Domina le tue frequenze vocali.
                        </p>
                    </div>
                </div>

                {/* BOTTOM LEFT: Info Panel (Responsive) */}
                <div className="pointer-events-none flex flex-col justify-end items-start md:items-end w-full">
                    {/* Placeholder for layout balance if needed */}
                </div>
            </div>

            {/* 3. ORBITAL SYSTEM CONTAINER - Flexbox Vertical Stack on Mobile */}
            <div className="flex flex-col items-center justify-center gap-16 md:gap-0 w-full">

                {/* ORBITAL SYSTEM - "LIVING LIGHT" */}
                <div className="relative w-[60vmin] h-[60vmin] md:w-[90vmin] md:h-[90vmin] flex items-center justify-center transition-transform duration-500 flex-shrink-0">

                    {/* EMITTING CORE - "The Pearl Eclipse" */}
                    {/* 1. Outer Glow (Large Breath) - Slower (10s), White/Pearl */}
                    <div className="absolute z-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-[pulse_10s_infinite]"></div>

                    {/* 2. Inner Shockwave Ring - Slower (8s), Subtle Silver */}
                    <div className="absolute z-10 w-32 h-32 rounded-full border border-white/20 animate-[ping_8s_infinite]"></div>

                    {/* 3. The Mic Itself (Solid Obsidian + Pearl Light) */}
                    <div className="absolute z-20 w-24 h-24 bg-black rounded-full backdrop-blur-xl border border-white/50 shadow-[0_0_60px_rgba(255,255,255,0.3)] flex items-center justify-center group cursor-pointer hover:scale-110 transition-transform duration-500">
                        <Mic className="w-10 h-10 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.9)] animate-[pulse_6s_infinite]" />
                    </div>

                    {/* Orbits & Nodes - "Responding to the Light" */}
                    {orbitVisuals.map((orbit, orbitIndex) => {
                        // Colors: Warm Champagne Gold Borders (Alive)
                        let borderColor = 'border-amber-200/10';
                        // Every orbit has a subtle faint glow
                        const shadow = 'shadow-[0_0_15px_rgba(251,191,36,0.05)_inset]';

                        // ANIMATION FIX: Use standard 'spin' with 'reverse' keyword instead of custom 'spin-reverse'
                        const animationName = 'spin';
                        const direction = orbit.isReverse ? 'reverse' : 'normal';

                        return (
                            <div
                                key={orbitIndex}
                                className={`absolute rounded-full border ${borderColor} ${shadow} pointer-events-none transition-all duration-1000 ease-in-out`}
                                style={{
                                    width: `${orbit.radius * 2}%`,
                                    height: `${orbit.radius * 2}%`,
                                    animation: `${animationName} ${orbit.duration}s linear infinite ${direction}`,
                                    animationDelay: `${orbit.delay}s`,
                                    zIndex: 20 - orbitIndex
                                }}
                            >
                                {/* "Pulsar Light" on the Orbit Ring itself - Traveling Particle */}
                                {/* ORGANIC PULSE: Applies random delay and duration so they breathe independently */}
                                <div
                                    className="absolute top-0 left-1/2 w-1 h-32 bg-gradient-to-b from-amber-200/0 via-amber-100 to-amber-200/0 transform -translate-x-1/2 blur-md"
                                    style={{
                                        animation: `pulse ${orbit.pulseDuration}s infinite`,
                                        animationDelay: `${orbit.pulseDelay}s`,
                                        opacity: 0.8
                                    }}
                                ></div>

                                {/* Nodes on this orbit */}
                                {orbit.nodes.map((nodeIndex) => {
                                    const theme = PODCAST_THEMES[nodeIndex % PODCAST_THEMES.length];
                                    const mastermind = course.masterminds[nodeIndex];
                                    const isHovered = hoveredNode === nodeIndex;
                                    const isComplete = isWorldComplete(mastermind);

                                    return (
                                        <div
                                            key={nodeIndex}
                                            className="absolute cursor-pointer group pointer-events-auto"
                                            style={{
                                                top: '0%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                            }}
                                            onMouseEnter={() => {
                                                setHoveredNode(nodeIndex);
                                                playSound('hover');
                                            }}
                                            onMouseLeave={() => setHoveredNode(null)}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                playSound('click');
                                                onSelectWorld(mastermind.id);
                                            }}
                                        >
                                            {/* Counter-Rotating Container */}
                                            <div
                                                className="relative flex items-center justify-center"
                                                style={{
                                                    animation: `${animationName} ${orbit.duration}s linear infinite ${direction === 'normal' ? 'reverse' : 'normal'}`,
                                                    animationDelay: `${orbit.delay}s`
                                                }}
                                            >
                                                {/* ECLIPSE INTERFERENCE LAYER (Moon Frequency) */}
                                                <div
                                                    className="absolute inset-0 flex items-center justify-center"
                                                    style={{
                                                        animation: `eclipse-interference ${15 + (nodeIndex % 4) * 5}s infinite linear`, // Matches Mini MOON duration
                                                    }}
                                                >
                                                    {/* Pulse Ring - Reacting to the Mini Sun - Synced Heartbeat */}
                                                    <div
                                                        className={`absolute inset-0 -m-4 ${isComplete ? 'bg-amber-400' : 'bg-amber-100'} rounded-full animate-ping opacity-10 group-hover:opacity-40`}
                                                        style={{
                                                            width: '100%', height: '100%',
                                                            animationDuration: `${8 + (nodeIndex % 3) * 3}s` // Matches Mini SUN duration
                                                        }}
                                                    ></div>
                                                </div>

                                                {/* MINI SOLAR SYSTEM (Sub-Orbits) */}
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

                                                    {/* 1. MINI SUN (Inner Orbit, Gold, Fast) */}
                                                    {/* Duration: Prime-ish variations (3s, 4s, 5s) based on index */}
                                                    <div
                                                        className="absolute rounded-full border border-amber-500/0 animate-[spin_3s_linear_infinite]"
                                                        style={{
                                                            width: '160%',
                                                            height: '160%',
                                                            animationDuration: `${8 + (nodeIndex % 3) * 3}s`
                                                        }}
                                                    >
                                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 md:w-1.5 h-1 md:h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,1)]"></div>
                                                    </div>

                                                    {/* 2. MINI MOON (Outer Orbit, Silver, Slower, Reverse) */}
                                                    {/* Duration: Prime variations (5s, 7s, 11s) */}
                                                    <div
                                                        className="absolute rounded-full border border-indigo-200/0 animate-[spin_5s_linear_infinite_reverse]"
                                                        style={{
                                                            width: '220%',
                                                            height: '220%',
                                                            animationDuration: `${15 + (nodeIndex % 4) * 5}s`
                                                        }}
                                                    >
                                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1 h-1 bg-stone-200 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
                                                    </div>
                                                </div>

                                                {/* Core Node Circle */}
                                                <div className={`
                                                    w-8 h-8 md:w-10 md:h-10 rounded-full border 
                                                    flex items-center justify-center z-10
                                                    font-mono font-bold text-sm tracking-tighter backdrop-blur-md
                                                    transition-all duration-300
                                                    ${isHovered
                                                        ? 'bg-amber-100 border-white text-black scale-125 shadow-[0_0_40px_rgba(251,191,36,0.8)]' // Hover: Explosive Light
                                                        : (isComplete
                                                            ? 'bg-amber-900/40 border-amber-400 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.3)]' // Complete: Deep Gold
                                                            : 'bg-black/80 border-amber-200/60 text-amber-100 shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:border-amber-200 hover:text-white hover:shadow-[0_0_30px_rgba(251,191,36,0.6)]') // Default: Sunlit Gold (was Dim)
                                                    }
                                                `}
                                                    style={{
                                                        // ECLIPSE LOGIC: The Node BLACKS OUT when the Moon passes
                                                        animation: `eclipse-interference ${15 + (nodeIndex % 4) * 5}s infinite linear`
                                                    }}
                                                >
                                                    {isComplete ? <Check className="w-4 h-4" /> : (nodeIndex + 1).toString().padStart(2, '0')}
                                                </div>

                                                {/* Mini Label on Hover - Hidden on Mobile to avoid overlap */}
                                                {isHovered && (
                                                    <div className="absolute top-full mt-3 w-40 text-center pointer-events-none z-[100] hidden md:block">
                                                        <div className="text-[10px] uppercase tracking-wider bg-black/80 text-amber-100 px-2 py-1 rounded border border-amber-200/30 shadow-xl backdrop-blur-xl">
                                                            {theme.name}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>

                {/* 4. FOOTER BOXES - BELOW ORBITAL SYSTEM (Mobile) + Left Aligned (Desktop/Tablet) */}
                <div className="w-full px-6 md:px-0 md:absolute md:bottom-32 md:left-8 z-40 pointer-events-none flex flex-col items-center md:items-start md:text-left transition-all duration-500 pb-8 md:pb-0">

                    {hoveredNode !== null ? (
                        // ACTIVE STATE: Module Info
                        <div className="animate-[slideUp_0.3s_ease-out] w-full md:w-auto pointer-events-auto">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2 opacity-80">
                                <Waves className="w-4 h-4 text-amber-400 animate-pulse" />
                                <span className="text-amber-200 font-mono text-xs uppercase tracking-[0.2em]">
                                    Frequenza {hoveredNode + 1}.0 Hz
                                </span>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 leading-tight drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                                {PODCAST_THEMES[hoveredNode % PODCAST_THEMES.length]?.name || "FREQUENZA IGNOTA"}
                            </h2>

                            <p className="text-amber-100/60 font-serif italic text-sm md:text-base mb-6 max-w-sm md:max-w-lg mx-auto md:mx-0">
                                "{PODCAST_THEMES[hoveredNode % PODCAST_THEMES.length]?.subname || "Sintonizzazione in corso..."}"
                            </p>

                            {/* START BUTTON (Active State) */}
                            <button
                                onClick={() => {
                                    playSound('click');
                                    onSelectWorld(course.masterminds[hoveredNode].id);
                                }}
                                className="md:hidden group relative w-auto px-8 py-3 bg-lux-gold text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] rounded-full flex items-center justify-center gap-3 mx-auto"
                            >
                                <Play className="w-4 h-4 fill-current relative z-10" />
                                <span className="relative z-10">Entra nella Frequenza</span>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity blur-md rounded-full"></div>
                            </button>

                            <div className="h-1 w-full bg-stone-900/50 rounded-full overflow-hidden border border-white/10 hidden md:block">
                                <div className="h-full bg-amber-200 animate-[loading_1s_infinite] shadow-[0_0_15px_rgba(251,191,36,0.8)]"></div>
                            </div>
                        </div>
                    ) : (
                        // DEFAULT STATE: "Il Viaggio" (Logic of Continuation)
                        <div className="animate-[fadeIn_0.5s_ease-out] w-full md:w-auto opacity-90 pointer-events-auto flex flex-col items-center md:items-start">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                <span className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em] drop-shadow-md">
                                    Il Viaggio Sonoro
                                </span>
                            </div>
                            <p className="text-amber-100/60 text-xs md:text-sm max-w-sm mx-auto md:mx-0 leading-relaxed font-serif tracking-wide mb-6 text-center md:text-left">
                                Scansiona le orbite per sintonizzarti sulle frequenze.
                                <br className="hidden md:block" />
                                Ogni livello espande il tuo impero invisibile.
                            </p>

                            {/* MAIN START BUTTON (Default State) */}
                            <button
                                onClick={() => {
                                    playSound('click');
                                    onSelectWorld(course.masterminds[0].id);
                                }}
                                className="group relative w-auto px-8 py-3 bg-lux-gold text-black font-bold uppercase tracking-[0.2em] text-xs md:text-sm hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] rounded-full flex items-center gap-3"
                            >
                                <Play className="w-4 h-4 fill-current relative z-10" />
                                <span className="relative z-10">Inizia il Viaggio</span>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity blur-md rounded-full"></div>
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
