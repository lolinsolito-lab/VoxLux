import React, { useMemo } from 'react';

export const PodcastAtmosphere: React.FC = React.memo(() => {
    // 1. GENERATE DEEP SPACE STARS (Static)
    const stars = useMemo(() => Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        size: Math.random() < 0.3 ? 3 : 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 2 + Math.random() * 3
    })), []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* 0. DEEP SPACE - Stars Background */}
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute bg-white rounded-full"
                    style={{
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        opacity: Math.random() * 0.8 + 0.4,
                        animation: `pulse ${star.duration}s infinite ${star.delay}s`
                    }}
                />
            ))}

            {/* 1. SONIC ATMOSPHERE - "Golden Ether" */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-black to-black animate-pulse pointer-events-none"></div>

            {/* 1.5 NEBULAE - "Strategic Cosmic Clouds" */}
            {/* Nebula 1: Mystic Violet (Top Right) */}
            <div className="absolute -top-20 -right-20 md:top-[-20%] md:right-[-10%] w-[80vw] h-[80vw] md:w-[45vw] md:h-[45vw] bg-indigo-900/20 rounded-full blur-[80px] md:blur-[120px] animate-[pulse_8s_infinite] mix-blend-screen pointer-events-none"></div>

            {/* Nebula 2: Deep Teal (Bottom Left) */}
            <div className="absolute -bottom-20 -left-20 md:bottom-[-20%] md:left-[-10%] w-[80vw] h-[80vw] md:w-[45vw] md:h-[45vw] bg-teal-900/20 rounded-full blur-[80px] md:blur-[120px] animate-[pulse_12s_infinite] mix-blend-screen delay-1000 pointer-events-none"></div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
});
