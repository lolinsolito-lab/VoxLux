import React, { useMemo, useState, useEffect } from 'react';

export const CosmicAtmosphere: React.FC = React.memo(() => {
    // Mobile detection for performance optimization
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);
    // 1. GENERATE SHOOTING STARS (Static Set)
    const shootingStars = useMemo(() => Array.from({ length: isMobile ? 2 : 8 }).map((_, i) => ({
        id: i,
        top: Math.random() * 70,
        left: Math.random() * 80,
        delay: Math.random() * 6
    })), [isMobile]);

    // 2. GENERATE LIVING STARS (Dense & Organic)
    const starCount = isMobile ? 120 : 850;
    const livingStars = useMemo(() => Array.from({ length: starCount }).map((_, i) => {
        const spreadX = (Math.random() - 0.5) * 130;
        const spreadY = (Math.random() - 0.5) * (35 * Math.exp(-Math.pow(spreadX / 45, 2)) + 5);

        const colorClass = [
            'bg-amber-100', 'bg-orange-200',
            'bg-blue-100', 'bg-cyan-50',
            'bg-white', 'bg-white',
            'bg-rose-200'
        ][Math.floor(Math.random() * 7)] || 'bg-white';

        return {
            id: i,
            left: `${50 + spreadX}%`,
            top: `${50 + spreadY}%`,
            width: `${Math.random() * 2.5 + 0.5}px`,
            height: `${Math.random() * 2.5 + 0.5}px`,
            opacity: Math.random() * 0.7 + 0.3,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 3 + 3}s`,
            colorClass
        };
    }), [starCount]);

    // 3. GENERATE FLOAT PARTICLES
    const particles = useMemo(() => Array.from({ length: isMobile ? 5 : 20 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        width: Math.random() * 4,
        height: Math.random() * 4,
        delay: Math.random() * 5,
        duration: 10 + Math.random() * 10
    })), [isMobile]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* A. DEEP SPACE BACKGROUND */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-black to-black animate-[pulse_10s_infinite]"></div>
            {!isMobile && <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[spin_120s_linear_infinite]"></div>}

            {/* B. MILKY WAY COMPOSITION */}
            <div className="absolute inset-0 flex items-center justify-center">

                {/* 1. Base Void Glow */}
                <div className="absolute w-[150%] h-[60vh] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/10 via-transparent to-transparent blur-[100px] opacity-60"></div>

                {/* 2. Galactic Clouds */}
                <div className="absolute w-[80%] h-[20vh] -left-[10%] top-[45%] bg-[radial-gradient(closest-side,rgba(251,191,36,0.1),transparent)] blur-[40px] transform rotate-12"></div>
                <div className="absolute w-[80%] h-[20vh] -right-[10%] top-[42%] bg-[radial-gradient(closest-side,rgba(251,191,36,0.1),transparent)] blur-[40px] transform -rotate-12"></div>
                <div className="absolute w-[60%] h-[30vh] bg-[radial-gradient(circle_at_center,rgba(255,247,237,0.2)_0%,rgba(217,119,6,0.08)_40%,transparent_70%)] blur-[50px] mix-blend-screen z-10"></div>

                {/* 3. Dust Lanes */}
                <div className="absolute w-[120%] h-[8vh] bg-gradient-to-r from-transparent via-black/80 to-transparent blur-[15px] z-10 mix-blend-multiply opacity-90 rotate-1"></div>
                <div className="absolute w-[40%] h-[5vh] left-[20%] top-[48%] bg-black/60 blur-[12px] mix-blend-multiply rotate-3 rounded-full"></div>
                <div className="absolute w-[40%] h-[5vh] right-[20%] top-[52%] bg-black/60 blur-[12px] mix-blend-multiply -rotate-2 rounded-full"></div>

                {/* 4. Star Mist */}
                <div className="absolute w-[80%] h-[20vh] opacity-60 mix-blend-screen z-10">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-repeat opacity-40"></div>
                </div>

                {/* 5. LIVING STARS */}
                <div className="absolute inset-0 w-full h-full flex items-center justify-center z-20 pointer-events-none">
                    <div className="absolute w-[90%] h-[40vh]">
                        {livingStars.map((star) => (
                            <div
                                key={`living-star-${star.id}`}
                                className={`absolute rounded-full ${star.colorClass} blur-[0.4px] animate-[twinkle_4s_infinite_ease-in-out]`}
                                style={{
                                    left: star.left,
                                    top: star.top,
                                    width: star.width,
                                    height: star.height,
                                    opacity: star.opacity,
                                    animationDelay: star.animationDelay,
                                    animationDuration: star.animationDuration,
                                    boxShadow: `0 0 ${Math.random() * 4 + 2}px currentColor`
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* 6. Core Highlight */}
                <div className="absolute w-[30%] h-[10vh] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.4)_0%,transparent_70%)] blur-[35px] mix-blend-overlay z-20"></div>
            </div>

            {/* C. PARTICLES */}
            {particles.map((p) => (
                <div
                    key={`particle-${p.id}`}
                    className="absolute rounded-full bg-lux-gold/60 blur-[2px] animate-[float_10s_infinite]"
                    style={{
                        top: `${p.top}%`,
                        left: `${p.left}%`,
                        width: `${p.width}px`,
                        height: `${p.height}px`,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`
                    }}
                />
            ))}

            {/* D. SHOOTING STARS */}
            {shootingStars.map((star) => (
                <div
                    key={`shooting-star-atm-${star.id}`}
                    className="absolute animate-[shoot_4s_infinite]"
                    style={{
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        animationDelay: `${star.delay}s`,
                        opacity: 0
                    }}
                >
                    <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_15px_white] absolute top-0 left-0 z-10"></div>
                    <div className="w-[150px] h-[2px] bg-gradient-to-l from-transparent via-lux-gold to-white absolute top-0 right-0 transform origin-right"></div>
                </div>
            ))}

            {/* E. STYLES (Keyframes) */}
            <style jsx>{`
                @keyframes shoot {
                    0% { transform: translate(0, 0) rotate(45deg) scale(0.5); opacity: 0; }
                    10% { opacity: 1; transform: translate(20px, 20px) rotate(45deg) scale(1); }
                    100% { transform: translate(300px, 300px) rotate(45deg) scale(1); opacity: 0; }
                }
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                @keyframes float {
                    0%, 100% { transform: translate(0, 0); opacity: 0.6; }
                    50% { transform: translate(10px, -10px); opacity: 0.3; }
                }
            `}</style>
        </div>
    );
});
