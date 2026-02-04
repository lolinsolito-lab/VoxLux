import React from 'react';
import { Mastermind } from '../../services/courseData';
import { WorldTheme } from '../../services/themeRegistry';

interface WorldProps {
    mastermind: Mastermind;
    theme: WorldTheme;
    onInteract: () => void;
    currentModuleIdx: number;
}

export const World1Origine: React.FC<WorldProps> = ({ mastermind, theme, onInteract, currentModuleIdx }) => {
    return (
        // WORLD 1: ORIGINE - THE BREATHING PORTAL
        <div className="relative flex items-center justify-center animate-[fadeIn_1s]">
            {/* Portal Core: Breathing Blue/Black */}
            <div
                onClick={onInteract}
                className="w-64 h-96 rounded-[50%] bg-gradient-to-b from-indigo-950 via-black to-indigo-950 border-2 border-amber-500/30 shadow-[0_0_80px_rgba(59,130,246,0.3)] animate-[pulse_4s_infinite] relative overflow-hidden group hover:scale-105 transition-transform duration-1000 cursor-pointer"
            >
                {/* Inner Myst: Moving fog */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 animate-[spin_60s_linear_infinite]"></div>

                {/* Gold Veins: Animated SVG Lines */}
                <svg className="absolute inset-0 w-full h-full opacity-60 mix-blend-overlay pointer-events-none" viewBox="0 0 100 200">
                    <path d="M50 0 Q 20 50 50 100 T 50 200" fill="none" stroke="#fbbf24" strokeWidth="0.5" className="animate-[pulse_3s_infinite]" />
                    <path d="M50 200 Q 80 150 50 100 T 50 0" fill="none" stroke="#fbbf24" strokeWidth="0.5" className="animate-[pulse_4s_infinite]" />
                </svg>

                {/* Interaction Overlay */}
                <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors duration-500"></div>
            </div>

            {/* Active Rune for this Module - Floating In Front */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                <div className="w-24 h-24 rounded-full border border-amber-500/50 flex items-center justify-center bg-black/40 backdrop-blur-sm shadow-[0_0_30px_rgba(251,191,36,0.4)] animate-[spin_12s_linear_infinite_reverse]">
                    {/* The Rune Icon - Based on module index */}
                    <div className={`w-12 h-12 bg-amber-400 mask-image-[url('https://www.transparenttextures.com/patterns/gplay.png')] animate-pulse ${currentModuleIdx === 1 ? 'rotate-45' : currentModuleIdx === 2 ? 'rotate-90' : ''} transition-transform duration-700`}></div>
                </div>
            </div>

            {/* Floating Particles - Sparks */}
            {[...Array(8)].map((_, i) => (
                <div key={i} className="absolute w-1 h-1 bg-amber-200 rounded-full animate-[ping_3s_infinite]" style={{
                    top: `${Math.random() * 120 - 10}%`,
                    left: `${Math.random() * 120 - 10}%`,
                    animationDelay: `${i * 0.4}s`
                }}></div>
            ))}

            <div className="absolute -bottom-20 text-amber-200 font-serif italic text-sm tracking-widest opacity-60 animate-pulse whitespace-nowrap">
                [ {mastermind.modules[currentModuleIdx].title} ]
            </div>
        </div>
    );
};
