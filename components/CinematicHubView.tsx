import React, { useEffect, useState } from 'react';
import { COURSES, Mastermind } from '../services/courseData';
import { WORLD_THEMES } from '../services/themeRegistry';
import { useAudioSystem } from '../hooks/useAudioSystem';
import { Play, Sparkles, Star, ArrowLeft, Check } from 'lucide-react';
import { StorytellingLivingTree } from './StorytellingLivingTree';
import { CosmicAtmosphere } from './CosmicAtmosphere';

interface CinematicHubViewProps {
    courseId: string;
    onSelectWorld: (worldId: string) => void;
    onBack: () => void;
    completedModules: Set<string>;
}

export const CinematicHubView: React.FC<CinematicHubViewProps> = ({ courseId, onSelectWorld, onBack, completedModules }) => {
    const { playSound } = useAudioSystem();
    const course = COURSES[courseId] || COURSES['matrice-1'];
    const [hoveredNode, setHoveredNode] = useState<number | null>(null);

    // Background (Stars/Atmosphere) moved to <CosmicAtmosphere /> to prevent re-renders

    useEffect(() => {
        // Intro sound
        playSound('ambient_transition');
    }, [playSound]);

    // MAP COORDINATES (Semi-random constellation pattern)
    // x, y in percentages
    const MAP_NODES = [
        { x: 50, y: 80 }, // 1. Origine (Bottom Center)
        { x: 30, y: 70 }, // 2. Library (Left Low)
        { x: 70, y: 70 }, // 3. Workshop (Right Low)
        { x: 20, y: 50 }, // 4. Echo (Left Mid)
        { x: 80, y: 50 }, // 5. Fortress (Right Mid)
        { x: 35, y: 35 }, // 6. Sanctuary (Left High)
        { x: 65, y: 35 }, // 7. Value (Right High)
        { x: 50, y: 25 }, // 8. Time (Top Center Low)
        { x: 50, y: 15 }, // 9. Loyalty (Top Center Mid)
        { x: 50, y: 5 }   // 10. Mastery (Top Peak)
    ];

    const isWorldComplete = (mm: Mastermind) => {
        if (!mm.modules || mm.modules.length === 0) return false;
        return mm.modules.every(m => completedModules.has(m.id));
    };

    return (
        <div className="fixed inset-0 bg-black overflow-hidden font-sans select-none">

            {/* 1. ATMOSPHERE BACKGROUND - Memoized Component */}
            <CosmicAtmosphere />

            {/* 2. HERO SECTION (Left Overlay) - Z-INDEX INCREASED to 30 */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-30 flex flex-col justify-between p-6 md:p-16">

                {/* Header / Vox Lux Silhouette */}
                <div className="flex justify-between items-start animate-[fadeIn_1s_ease-out]">
                    <div className="flex flex-col items-start gap-6">
                        <button
                            onClick={onBack}
                            className="pointer-events-auto text-white/50 hover:text-white flex items-center gap-2 group transition-colors"
                            onMouseEnter={() => playSound('hover')}
                        >
                            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            <span className="uppercase tracking-[0.2em] text-xs font-bold">Torna alla Lista</span>
                        </button>
                    </div>

                    <div className="text-right relative">
                        {/* SOLAR FLARE EFFECT - The Source of Light */}
                        <div className="absolute -top-20 -right-20 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.15)_0%,transparent_70%)] blur-3xl pointer-events-none -z-10 animate-pulse"></div>

                        <h1 className="text-4xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-lux-gold to-amber-500 drop-shadow-[0_0_35px_rgba(251,191,36,0.6)] relative z-10">
                            STORYTELLING <br /> MASTERMIND
                        </h1>
                        <p className="text-lux-gold/90 font-serif italic mt-2 tracking-wide drop-shadow-md">
                            L'Arte della Neuro-Narrazione
                        </p>
                    </div>
                </div>

                {/* Footer Pillars / CTA - Added Mobile Gradient Background */}
                <div className={`
                    max-w-xl pointer-events-auto relative z-40 p-6 -mx-4 md:p-0 md:mx-0 rounded-t-[2rem] md:rounded-none flex flex-col items-center md:items-start text-center md:text-left transition-all duration-300
                    bg-gradient-to-t from-black via-black/95 to-transparent md:bg-none
                `}>
                    <h2 className="text-white text-sm md:text-lg uppercase tracking-widest mb-2 flex items-center gap-2 md:gap-3 h-8">
                        <Sparkles className={`w-4 h-4 md:w-5 md:h-5 ${hoveredNode !== null ? 'text-amber-400 rotate-12 transition-all' : 'text-lux-gold'}`} />
                        <span className="transition-all duration-300">
                            {hoveredNode !== null
                                ? WORLD_THEMES[hoveredNode]?.name || "MONDO SCONOSCIUTO"
                                : "Il Viaggio dei 10 Mondi"
                            }
                        </span>
                    </h2>

                    <div className="relative h-16 md:h-12 w-full flex flex-col justify-center items-center md:items-start">
                        {/* Static Description */}
                        <p className={`
                            absolute top-0 transition-opacity duration-300 text-amber-100/60 leading-relaxed border-none md:border-l-2 md:border-lux-gold/30 md:pl-4 text-xs md:text-base max-w-sm md:max-w-none
                            ${hoveredNode === null ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
                        `}>
                            Non è un corso. È un'esplorazione. Attraversa i regni, supera i rituali e conquista la tua voce definitiva.
                        </p>

                        {/* Dynamic Description (Mastermind Title) */}
                        <p className={`
                            absolute top-0 transition-all duration-300 text-white font-serif italic text-sm md:text-lg tracking-wide
                            ${hoveredNode !== null ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
                        `}>
                            {hoveredNode !== null ? course.masterminds[hoveredNode]?.title : ''}
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            playSound('click');
                            // If hovering, go to that specific world. Else go to the first one/current progress.
                            const targetId = hoveredNode !== null
                                ? course.masterminds[hoveredNode].id
                                : course.masterminds[0].id;
                            onSelectWorld(targetId);
                        }}
                        className={`
                            group relative w-auto px-8 py-3 font-bold uppercase tracking-[0.2em] text-xs md:text-sm transition-all duration-300 shadow-[0_0_20px_rgba(251,191,36,0.3)] rounded-full flex items-center gap-3 mt-4 overflow-hidden
                            ${hoveredNode !== null
                                ? 'bg-amber-500 text-black hover:bg-white hover:shadow-[0_0_40px_rgba(251,191,36,0.8)]'
                                : 'bg-lux-gold text-black hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.6)]'
                            }
                        `}
                    >
                        <Play className="w-4 h-4 fill-current relative z-10 transition-transform group-hover:scale-110" />
                        <span className="relative z-10">
                            {hoveredNode !== null ? "Entra nel Mondo" : "Inizia il Viaggio"}
                        </span>

                        {/* Hover Flush Effect */}
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity blur-md rounded-full"></div>
                    </button>

                    <div className="mt-4 text-[10px] text-gray-500 uppercase tracking-widest animate-pulse hidden md:block">
                        {hoveredNode !== null ? `Mondo ${hoveredNode + 1} di 10` : "Clicca su un nodo per teletrasportarti"}
                    </div>
                </div>
            </div>

            {/* 3. VOX SEPHIRA - 3D INTERACTIVE GALAXY (Replaces 2D Map) */}
            {/* 3. VOX SEPHIRA - 2D LIVING TREE (Replaces Galaxy) */}
            <StorytellingLivingTree
                masterminds={course.masterminds}
                completedModules={completedModules}
                onSelectWorld={(id) => {
                    playSound('click');
                    onSelectWorld(id);
                }}
                onHoverNode={setHoveredNode}
            />

        </div>
    );
};
