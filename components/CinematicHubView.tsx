import React, { useEffect, useState } from 'react';
import { useCourseData } from '../hooks/useCourseData';
import { Mastermind } from '../services/courseData';
import { WORLD_THEMES } from '../services/themeRegistry';
import { useAudioSystem } from '../hooks/useAudioSystem';
import { Play, Sparkles, Star, ArrowLeft, Check } from 'lucide-react';
import { StorytellingLivingTree } from './StorytellingLivingTree';
import { CosmicAtmosphere } from './CosmicAtmosphere';
import { useGodMode } from '../hooks/useGodMode';

interface CinematicHubViewProps {
    courseId: string;
    onSelectWorld: (worldId: string) => void;
    onBack: () => void;
    completedModules: Set<string>;
}

export const CinematicHubView: React.FC<CinematicHubViewProps> = ({ courseId, onSelectWorld, onBack, completedModules }) => {
    const { playSound } = useAudioSystem();
    const { enabled: godMode } = useGodMode();
    // HYBRID INTEGRATION: Use hook for data
    const { course, loading } = useCourseData(courseId);
    const [hoveredNode, setHoveredNode] = useState<number | null>(null);
    const [selectedNode, setSelectedNode] = useState<number | null>(null);

    // DISPLAY LOGIC: Hover takes precedence for "Looking around", but Selection persists when moving to button.
    // Actually, if I am selecting Node 5, and I hover Node 2, I should probably see Node 2?
    // Standard UI: Hover overrides Selection for preview.
    // BUT: If I move mouse OUT of Node 2, I should return to Node 5 (Selection), not null.
    const displayNode = hoveredNode ?? selectedNode;

    // Background (Stars/Atmosphere) moved to <CosmicAtmosphere /> to prevent re-renders

    useEffect(() => {
        // Intro sound
        playSound('ambient_transition');
    }, [playSound]);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
                <div className="w-16 h-16 border-4 border-lux-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!course) return null; // Should not happen due to fallback logic

    const isWorldComplete = (mm: Mastermind) => {
        if (!mm.modules || mm.modules.length === 0) return false;
        return mm.modules.every(m => completedModules.has(m.id));
    };

    return (
        <div
            className="fixed inset-0 bg-black overflow-hidden font-sans select-none"
            onClick={() => setSelectedNode(null)} // Background click clears selection
        >

            {/* 1. ATMOSPHERE BACKGROUND - Memoized Component */}
            <CosmicAtmosphere />

            {/* 2. HERO SECTION - UI OVERLAY */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-30 flex flex-col md:flex-row justify-between p-4 md:p-16">

                {/* TOP LEFT GROUP (Mobile & Desktop Back Button) */}
                <div className="absolute top-6 left-6 z-50 flex flex-col items-start gap-4">
                    {/* BACK BUTTON */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onBack();
                        }}
                        className="pointer-events-auto text-white/50 hover:text-white flex items-center gap-2 group transition-colors"
                        onMouseEnter={() => playSound('hover')}
                    >
                        <ArrowLeft className="group-hover:-translate-x-1 transition-transform w-5 h-5" />
                        <span className="uppercase tracking-[0.2em] text-xs font-bold hidden md:inline">Torna alla Lista</span>
                        <span className="uppercase tracking-[0.2em] text-[10px] font-bold md:hidden">Indietro</span>
                    </button>

                    {/* MAIN TITLE (Mobile Only - Small & Elegant) */}
                    <div className="md:hidden mt-2 pointer-events-auto">
                        <h1 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-lux-gold to-amber-500 drop-shadow-md text-left leading-tight">
                            STORYTELLING <br /> MASTERMIND
                        </h1>
                        <p className="text-lux-gold/80 font-serif italic mt-1 text-xs text-left">
                            L'Arte della Neuro-Narrazione
                        </p>
                    </div>
                </div>

                {/* DESKTOP TITLE GROUP (Top Right) */}
                <div className={`
                    hidden md:flex flex-col gap-6 
                    absolute top-16 right-16 items-end text-right pointer-events-none
                `}>
                    <div className="relative">
                        {/* SOLAR FLARE EFFECT (Desktop Only) */}
                        <div className="absolute -top-20 -right-20 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.15)_0%,transparent_70%)] blur-3xl pointer-events-none -z-10 animate-pulse"></div>

                        <h1 className="text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-lux-gold to-amber-500 drop-shadow-[0_0_35px_rgba(251,191,36,0.6)] relative z-10">
                            STORYTELLING <br /> MASTERMIND
                        </h1>
                        <p className="text-lux-gold/90 font-serif italic mt-2 tracking-wide drop-shadow-md text-xl">
                            L'Arte della Neuro-Narrazione
                        </p>
                    </div>
                </div>

                {/* FOOTER PILLARS / CTA (Mobile: Bottom Center, Desktop: Bottom Left) */}
                <div className={`
                    pointer-events-auto z-40 
                    absolute bottom-0 left-0 w-full pb-4 flex flex-col items-center text-center 
                    md:bottom-16 md:left-16 md:w-auto md:items-start md:text-left md:pb-0
                `}>
                    <h2 className="text-white text-sm md:text-lg uppercase tracking-widest mb-0 flex items-center gap-2 md:gap-3 h-8">
                        <Sparkles className={`w-4 h-4 md:w-5 md:h-5 ${displayNode !== null ? 'text-amber-400 rotate-12 transition-all' : 'text-lux-gold'}`} />
                        <span className="transition-all duration-300">
                            {displayNode !== null
                                ? (course.masterminds[displayNode]?.title || WORLD_THEMES[displayNode]?.name || "MONDO SCONOSCIUTO")
                                : "Il Viaggio dei 10 Mondi"
                            }
                        </span>
                    </h2>

                    <div className="relative h-20 md:h-28 w-full flex flex-col justify-center items-center md:items-start">
                        {/* Static Description */}
                        <p className={`
                            absolute top-0 transition-opacity duration-300 text-amber-100/80 leading-relaxed border-none md:border-l-2 md:border-lux-gold/30 md:pl-4 text-xs md:text-base max-w-sm md:max-w-none
                            ${displayNode === null ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
                        `}>
                            Non è un corso. È un'esplorazione. Attraversa i regni, supera i rituali e conquista la tua voce definitiva.
                        </p>

                        {/* Dynamic Description (Mastermind Title) */}
                        <p className={`
                            absolute top-0 transition-all duration-300 text-white font-serif italic text-sm md:text-lg tracking-wide
                            ${displayNode !== null ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
                        `}>
                            {displayNode !== null ? course.masterminds[displayNode]?.title : ''}
                        </p>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            playSound('click');
                            // If hovering/selected, go to that specific world. Else go to the first one/current progress.
                            const targetId = displayNode !== null
                                ? `${course.masterminds[displayNode].id}|${displayNode}`
                                : `${course.masterminds[0].id}|0`;
                            onSelectWorld(targetId);
                        }}
                        className={`
                            group relative w-auto px-8 py-3 font-bold uppercase tracking-[0.2em] text-xs md:text-sm transition-all duration-300 shadow-[0_0_20px_rgba(251,191,36,0.3)] rounded-full flex items-center gap-3 mt-1 overflow-hidden
                            ${displayNode !== null
                                ? 'bg-amber-500 text-black hover:bg-white hover:shadow-[0_0_40px_rgba(251,191,36,0.8)]'
                                : 'bg-lux-gold text-black hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.6)]'
                            }
                        `}
                    >
                        <Play className="w-4 h-4 fill-current relative z-10 transition-transform group-hover:scale-110" />
                        <span className="relative z-10">
                            {displayNode !== null ? "Entra nel Mondo" : "Inizia il Viaggio"}
                        </span>

                        {/* Hover Flush Effect */}
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity blur-md rounded-full"></div>
                    </button>

                    <div className="mt-4 text-[10px] text-gray-500 uppercase tracking-widest animate-pulse hidden md:block">
                        {displayNode !== null ? `Mondo ${displayNode + 1} di 10` : "Clicca su un nodo per teletrasportarti"}
                    </div>
                </div>
            </div>

            {/* 3. VOX SEPHIRA - 2D LIVING TREE */}
            <StorytellingLivingTree
                masterminds={course.masterminds}
                completedModules={completedModules}
                onSelectWorld={(id) => {
                    // LEGACY: The tree might still call this, but we'll intercept in the tree itself
                    playSound('click');
                    onSelectWorld(id);
                }}
                onHoverNode={setHoveredNode}
                selectedNode={selectedNode}
                onNodeClick={setSelectedNode}
                isGodMode={godMode}
            />

        </div>
    );
};
