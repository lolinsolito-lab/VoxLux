import React, { useState, useMemo, useEffect } from 'react';
import { Mastermind, COURSES } from '../services/courseData';
import { WORLD_THEMES } from '../services/themeRegistry';
import { useAudioSystem } from '../hooks/useAudioSystem';
import { Sparkles, Check, Lock, Play } from 'lucide-react';

interface StorytellingLivingTreeProps {
    masterminds: Mastermind[];
    completedModules: Set<string>;
    onSelectWorld: (id: string) => void;
    onHoverNode?: (index: number | null) => void; // Optional for backward compatibility, but we'll use it.
}

// THE TREE OF LIFE LAYOUT (Percentages relative to CONTAINER)

// DESKTOP: Expanded, Majestic, "As Above, So Below"
const DESKTOP_NODES = [
    // ROW 1: BASE (1) - Pushed down for grounding
    { x: 50, y: 92, scale: 1.2 },  // 1. Origine (Was 93)
    // ROW 2: LOWER TRIAD (3) - Spaced vertically from base
    { x: 20, y: 70, scale: 1.0 },  // 2. Library
    { x: 50, y: 70, scale: 1.0 },  // 3. Workshop
    { x: 80, y: 70, scale: 1.0 },  // 4. Echo
    // ROW 3: MIDDLE TRIAD (3) - Central Heart
    { x: 20, y: 48, scale: 1.1 },  // 5. Fortress
    { x: 50, y: 48, scale: 1.1 },  // 6. Sanctuary
    { x: 80, y: 48, scale: 1.1 },  // 7. Value
    // ROW 4: UPPER PAIR (2)
    { x: 35, y: 28, scale: 1.1 },  // 8. Time
    { x: 65, y: 28, scale: 1.1 },  // 9. Loyalty
    // ROW 5: CROWN (1) - High but reachable
    { x: 50, y: 11, scale: 1.3 }   // 10. Mastery (Was 12)
];

// MOBILE: Compact, Safe Margins, "Fit to Screen"
const MOBILE_NODES = [
    // ROW 1: BASE (1)
    { x: 50, y: 75, scale: 1.2 },  // Lifted from 78
    // ROW 2: LOWER TRIAD (3)
    { x: 15, y: 62, scale: 1.0 }, // Compressed from 64
    { x: 50, y: 62, scale: 1.0 },
    { x: 85, y: 62, scale: 1.0 },
    // ROW 3: MIDDLE TRIAD (3)
    { x: 15, y: 50, scale: 1.1 }, // Center
    { x: 50, y: 50, scale: 1.1 },
    { x: 85, y: 50, scale: 1.1 },
    // ROW 4: UPPER PAIR (2)
    { x: 35, y: 38, scale: 1.1 }, // Lowered from 36
    { x: 65, y: 38, scale: 1.1 },
    // ROW 5: CROWN (1)
    { x: 50, y: 25, scale: 1.3 }  // Lowered from 22
];

// CONNECTIONS (Graph Edges - Flowing Upwards)
const CONNECTIONS = [
    // Base to Lower Row
    [0, 1], [0, 2], [0, 3],
    // Lower Row Horizontal
    [1, 2], [2, 3],
    // Lower to Middle (Vertical Flow)
    [1, 4], [2, 5], [3, 6],
    // Lower to Middle (Cross Flow)
    [1, 5], [3, 5],
    // Middle Row Horizontal
    [4, 5], [5, 6],
    // Middle to Upper (Vertical/Cross)
    [4, 7], [6, 8],
    [5, 7], [5, 8], // Center Middle feeds both Upper
    // Upper Row Horizontal
    [7, 8],
    // Upper to Crown
    [7, 9], [8, 9]
];

// Phase Types
type CosmicPhase = 'SUN' | 'MOON' | 'TRANSITION';

export const StorytellingLivingTree: React.FC<StorytellingLivingTreeProps> = ({
    masterminds,
    completedModules,
    onSelectWorld,
    onHoverNode
}) => {
    const { playSound } = useAudioSystem();
    const [hoveredNode, setHoveredNode] = useState<number | null>(null);
    const [globalPulse, setGlobalPulse] = useState(false);

    // Mobile detection for performance
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Select Active Configuration
    const activeNodes = isMobile ? MOBILE_NODES : DESKTOP_NODES;

    // Sacred Math: Prime Number Chronobiology
    // We assign unique PRIME NUMBER durations to each node to ensure cycles never align perfectly.
    // This creates an "Infinite Breath" effect where the pattern is always new.
    const nodeExhales = useMemo(() => {
        const primes = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43]; // 10 Primes for 10 Nodes
        return masterminds.map((_, i) => ({
            delay: i * 2.3, // Staggered start offset (also prime-ish)
            duration: primes[i] || 11 // Fallback if out of primes (shouldn't happen for 10 nodes)
        }));
    }, [masterminds]);

    // Global Pulse Loop (60s)
    useEffect(() => {
        const timer = setInterval(() => {
            setGlobalPulse(true);
            setTimeout(() => setGlobalPulse(false), 5000); // 5s majestic pulse
        }, 60000);

        // Initial "Big Bang" pulse
        setTimeout(() => setGlobalPulse(true), 1000);
        setTimeout(() => setGlobalPulse(false), 6000);

        return () => clearInterval(timer);
    }, []);

    const isWorldComplete = (mm: Mastermind) => {
        if (!mm.modules || mm.modules.length === 0) return false;
        return mm.modules.every(m => completedModules.has(m.id));
    };

    // Helper to get WORLD Theme
    const getTheme = (index: number) => {
        return WORLD_THEMES[index % WORLD_THEMES.length];
    };

    return (
        <div className="absolute inset-0 z-10 w-full h-full pointer-events-none flex items-center justify-center pb-48 md:pb-0">

            {/* Global CSS Styles for Custom Keyframes */}
            <style>{`
                @keyframes cycleSunMoon {
                    0%, 100% { 
                        opacity: 0.2; 
                        filter: drop-shadow(0 0 0px transparent);
                        transform: scale(1);
                    }
                    30% { 
                        opacity: 1; 
                        filter: drop-shadow(0 0 15px rgba(245, 225, 164, 0.4)); /* Champagne Gold */
                        border-color: rgba(245, 225, 164, 0.8);
                        background-color: rgba(245, 225, 164, 0.1);
                        transform: scale(1.03);
                    }
                    50% { 
                        opacity: 0.3; 
                        filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.1)); /* Transition */
                        border-color: rgba(255, 255, 255, 0.1);
                        background-color: rgba(0, 0, 0, 0.4);
                        transform: scale(1);
                    }
                    80% { 
                        opacity: 0.8; 
                        filter: drop-shadow(0 0 20px rgba(227, 201, 139, 0.5)); /* Metallic Gold */
                        border-color: rgba(212, 175, 55, 0.6);
                        background-color: rgba(212, 175, 55, 0.1);
                        transform: scale(1.02);
                    }
                }

                @keyframes pulseLine {
                    0%, 100% { stroke-opacity: 0.1; stroke: rgba(255,255,255,0.15); }
                    50% { stroke-opacity: 0.6; stroke: rgba(212, 175, 55, 0.4); } /* Metallic Gold Pulse */
                }
            `}</style>


            {/* CONTAINER: Mobile & Tablet Optimized */}
            {/* Mobile: Fill screen width, generous height for vertical spread */}
            {/* Tablet: max-w-[480px], relaxed aspect ratio */}
            {/* Desktop: lg:max-w-[550px] xl:max-w-[600px] */}
            <div className={`
                relative 
                w-full max-h-[60vh] aspect-[3/5] px-4 
                md:px-0 md:w-auto md:h-[80vh] md:max-h-[800px] md:aspect-[3/4]
                lg:h-[85vh] lg:max-h-[900px] lg:max-w-[650px]
                flex-shrink-0 transition-all duration-1000 ease-out
                ${!isMobile && globalPulse ? 'scale-105 filter drop-shadow-[0_0_50px_rgba(251,191,36,0.3)]' : ''}
            `}>

                {/* 1. CONNECTIONS LAYER (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    <defs>
                        <linearGradient id="cosmic-flow" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(251, 191, 36, 0)" />
                            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.8)" />
                            <stop offset="100%" stopColor="rgba(251, 191, 36, 0)" />
                        </linearGradient>
                    </defs>

                    {CONNECTIONS.map(([start, end], i) => {
                        const startNode = activeNodes[start];
                        const endNode = activeNodes[end];
                        // Link Connection Pulse to the Rhythm of the Start Node
                        const rhythm = nodeExhales[start];

                        return (
                            <g key={`conn-${i}`}>
                                {/* Connection Line - Pulses with the Cycle */}
                                <line
                                    x1={`${startNode.x}%`}
                                    y1={`${startNode.y}%`}
                                    x2={`${endNode.x}%`}
                                    y2={`${endNode.y}%`}
                                    stroke="url(#cosmic-flow)"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    className="transition-all"
                                    style={{
                                        animation: globalPulse
                                            ? 'pulseLine 2s infinite'
                                            : `pulseLine ${rhythm.duration}s infinite cubic-bezier(0.4, 0, 0.6, 1)`,
                                        animationDelay: `-${rhythm.delay}s` // Synced with source node
                                    }}
                                />

                                {/* Shooting Star (Thought Particle) - Desktop Only */}
                                {!isMobile && (
                                    <circle r="2" fill="white" className="opacity-0 filter drop-shadow-[0_0_4px_white]">
                                        <animate
                                            attributeName="cx" from={`${startNode.x}%`} to={`${endNode.x}%`}
                                            dur={`${3 + (i % 2)}s`} begin={`${i * 0.7}s`} repeatCount="indefinite"
                                        />
                                        <animate
                                            attributeName="cy" from={`${startNode.y}%`} to={`${endNode.y}%`}
                                            dur={`${3 + (i % 2)}s`} begin={`${i * 0.7}s`} repeatCount="indefinite"
                                        />
                                        <animate
                                            attributeName="opacity" values="0; 1; 0"
                                            dur={`${3 + (i % 2)}s`} begin={`${i * 0.7}s`} repeatCount="indefinite"
                                        />
                                    </circle>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* 2. NODES LAYER */}
                {masterminds.map((mm, index) => {
                    const pos = activeNodes[index];
                    const isHovered = hoveredNode === index;
                    const isComplete = isWorldComplete(mm);
                    const theme = getTheme(index);
                    const rhythm = nodeExhales[index];

                    // Interaction overrides cosmic cycle
                    const isActive = isHovered || isComplete || globalPulse;

                    return (
                        <div
                            key={mm.id}
                            className="absolute pointer-events-auto flex items-center justify-center group"
                            style={{
                                left: `${pos.x}%`,
                                top: `${pos.y}%`,
                                transform: 'translate(-50%, -50%)',
                                width: `${10 * pos.scale}%`,
                                aspectRatio: '1/1'
                            }}
                            onMouseEnter={() => {
                                setHoveredNode(index);
                                if (onHoverNode) onHoverNode(index);
                                playSound('hover');
                            }}
                            onMouseLeave={() => {
                                setHoveredNode(null);
                                if (onHoverNode) onHoverNode(null);
                            }}
                            onClick={() => {
                                playSound('click');
                                onSelectWorld(`${mm.id}|${index}`);
                            }}
                        >
                            {/* A. COSMIC ORBITS - Desktop Only */}
                            {!isMobile && (
                                <div
                                    className={`absolute rounded-full border border-white/10 w-[150%] h-[150%] animate-[spin_20s_linear_infinite]`}
                                />
                            )}

                            {/* Inner Active Ring - Desktop Only */}
                            {!isMobile && isActive && (
                                <div className="absolute rounded-full border border-amber-400/50 w-[130%] h-[130%] animate-[spin_4s_linear_infinite]" />
                            )}

                            {/* B. CELESTIAL BODIES (Orbiting Sun & Moon) - Desktop Only */}
                            {!isMobile && (
                                <div className="absolute inset-0 animate-[spin_10s_linear_infinite]" style={{ animationDuration: `${rhythm.duration * 2}s` }}>
                                    <div className="absolute -top-[20%] left-1/2 w-[8%] h-[8%] rounded-full bg-amber-400 shadow-[0_0_10px_orange]" />
                                    <div className="absolute -bottom-[20%] left-1/2 w-[6%] h-[6%] rounded-full bg-slate-300 shadow-[0_0_8px_white]" />
                                </div>
                            )}

                            {/* C. CORE SPHERE (THE WORLD) */}
                            <div
                                className={`
                                    relative w-full h-full rounded-full 
                                    flex items-center justify-center
                                    backdrop-blur-md border border-white/10
                                    transition-all duration-300
                                    ${isActive
                                        ? 'bg-[#3a2f15]/60 shadow-[0_0_25px_rgba(245,225,164,0.5)] border-[#F5E1A4] scale-110' // White Gold Champagne
                                        : ''
                                    }
                                `}
                                style={!isActive ? (isMobile ? {
                                    // Mobile: Static subtle glow instead of heavy animation
                                    borderColor: 'rgba(245, 225, 164, 0.3)',
                                    backgroundColor: 'rgba(245, 225, 164, 0.05)',
                                    boxShadow: '0 0 12px rgba(245, 225, 164, 0.2)'
                                } : {
                                    // Desktop: Full Cosmic Cycle Animation when idle
                                    animation: `cycleSunMoon ${rhythm.duration}s infinite ease-in-out`,
                                    animationDelay: `-${rhythm.delay}s`
                                }) : {}}
                            >
                                {/* Inner Pulse */}
                                <div className={`absolute inset-[10%] rounded-full opacity-50 mix-blend-screen transition-colors duration-500
                                    ${isActive ? 'bg-[#D4AF37] animate-pulse' : 'bg-white/5'}
                                `} />

                                {/* Icon / Number */}
                                <span className={`
                                    font-display font-bold text-xs md:text-sm lg:text-lg z-10 transition-colors duration-300
                                    ${isActive ? 'text-white' : 'text-white/40'}
                                `}>
                                    {isComplete ? <Check className="w-1/2 h-1/2" /> : (index + 1)}
                                </span>
                            </div>

                            {/* D. LABEL (On Hover) */}
                            <div className={`
                                absolute top-full mt-[10%] flex flex-col items-center pointer-events-none transition-all duration-300 z-50
                                ${isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-90'}
                            `}>
                                <h3 className="text-amber-100 font-display font-bold uppercase tracking-widest text-[10px] md:text-xs whitespace-nowrap bg-black/80 px-2 py-1 border border-amber-500/30 rounded shadow-xl">
                                    {theme?.name || mm.title}
                                </h3>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
};
