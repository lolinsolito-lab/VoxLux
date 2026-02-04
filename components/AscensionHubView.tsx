import React, { useEffect, useState } from 'react';
import { useAudioSystem } from '../hooks/useAudioSystem';
import { Play, Star, Shield, Zap, Lock, Unlock, ArrowRight, Crown, Brain, Sparkles, Gem } from 'lucide-react';
import { COURSES } from '../services/courseData';
import { VoxLuxLogo } from './icons/VoxLuxLogo';

interface AscensionHubViewProps {
    onSelectCourse: (courseId: string) => void;
    onBack: () => void;
}

// MEMOIZED STARS COMPONENT (Prevents re-render jitter)
const StarsMemo = React.memo(() => {
    // 1. Dense Core Stars
    const coreStars = React.useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
        top: `${20 + Math.random() * 60}%`,
        left: `${40 + Math.random() * 20}%`,
        size: Math.random() < 0.2 ? '2px' : '1px',
        opacity: 0.15 + Math.random() * 0.3, // VERY SUBTLE (Was 0.3-0.8)
        delay: `${Math.random() * 5}s`
    })), []);

    // 2. Outer Scattered Stars
    const outerStars = React.useMemo(() => Array.from({ length: 60 }).map((_, i) => ({
        top: `${Math.random() * 100}%`,
        left: `${20 + Math.random() * 60}%`,
        opacity: 0.1 + Math.random() * 0.2, // BARELY VISIBLE
        delay: `${Math.random() * 5}s`
    })), []);

    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[1200px] pointer-events-none transform rotate-[30deg]">
            {/* Dense Core Stars */}
            {coreStars.map((s, i) => (
                <div key={`mw-core-${i}`} className="absolute rounded-full bg-indigo-100 animate-[pulse_4s_infinite]"
                    style={{ top: s.top, left: s.left, width: s.size, height: s.size, opacity: s.opacity, animationDelay: s.delay }}
                />
            ))}
            {/* Scattered Outer Stars */}
            {outerStars.map((s, i) => (
                <div key={`mw-outer-${i}`} className="absolute rounded-full bg-white animate-[twinkle_6s_infinite]"
                    style={{ top: s.top, left: s.left, width: '1px', height: '1px', opacity: s.opacity, animationDelay: s.delay }}
                />
            ))}
            {/* A few Rare Golden Giants */}
            <div className="absolute top-[40%] left-[50%] w-0.5 h-0.5 bg-amber-200 animate-pulse opacity-50"></div>
            <div className="absolute top-[60%] left-[48%] w-0.5 h-0.5 bg-amber-200 animate-pulse opacity-50"></div>
        </div>
    );
});

// MEMOIZED GLOBAL PARTICLES
const GlobalParticlesMemo = React.memo(() => {
    const particles = React.useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 3}px`,
        delay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.3
    })), []);

    return (
        <>
            {particles.map((p, i) => (
                <div
                    key={`gp-${i}`}
                    className="absolute rounded-full bg-amber-300 blur-[1px] animate-[float_8s_infinite]"
                    style={{
                        top: p.top, left: p.left, width: p.size, height: p.size,
                        animationDelay: p.delay, opacity: p.opacity
                    }}
                />
            ))}
        </>
    );
});

export const AscensionHubView: React.FC<AscensionHubViewProps> = ({ onSelectCourse, onBack }) => {
    const { playSound } = useAudioSystem();
    const [activeHemisphere, setActiveHemisphere] = useState<'left' | 'right' | null>(null);

    useEffect(() => {
        playSound('ambient_transition');
    }, [playSound]);

    return (
        <div className="fixed inset-0 bg-black overflow-hidden font-sans select-none flex items-center justify-center">

            {/* 1. DIVINE ETHER BACKGROUND - HAZE REMOVED FOR PURE VOID */}
            {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-100/10 via-black to-black animate-pulse"></div> */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[spin_120s_linear_infinite]"></div>

            {/* GLOBAL PARTICLES (Reduced density) - MEMOIZED */}
            <GlobalParticlesMemo />

            {/* DYNAMIC ATMOSPHERE LAYERS */}

            {/* 1. STORYTELLING ATMOSPHERE (Left Hover) - The Living Tree Clone */}
            <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${activeHemisphere === 'left' ? 'opacity-100' : 'opacity-0'}`}>

                {/* The Tree of Life Container */}
                <div className="absolute top-1/2 left-[25%] transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[600px] opacity-80">

                    {/* A. CONNECTIONS (SVG Lines) */}
                    <svg className="absolute inset-0 w-full h-full overflow-visible">
                        {[
                            [0, 1], [0, 2], [0, 3], // Base to Lower
                            [1, 2], [2, 3], // Lower Horizontal
                            [1, 4], [2, 5], [3, 6], // Lower to Middle Vertical
                            [1, 5], [3, 5], // Lower to Middle Cross
                            [4, 5], [5, 6], // Middle Horizontal
                            [4, 7], [6, 8], // Middle to Upper Vertical
                            [5, 7], [5, 8], // Center Middle feeds Upper
                            [7, 8], // Upper Horizontal
                            [7, 9], [8, 9] // Upper to Crown
                        ].map(([start, end], i) => {
                            // Map indices to coordinates (Clone of StorytellingLivingTree MAP_NODES)
                            const nodes = [
                                { x: 50, y: 90 }, { x: 20, y: 72 }, { x: 50, y: 72 }, { x: 80, y: 72 },
                                { x: 20, y: 48 }, { x: 50, y: 48 }, { x: 80, y: 48 },
                                { x: 35, y: 25 }, { x: 65, y: 25 }, { x: 50, y: 8 }
                            ];
                            const p1 = nodes[start];
                            const p2 = nodes[end];
                            return (
                                <line
                                    key={`conn-${i}`}
                                    x1={`${p1.x}%`} y1={`${p1.y}%`}
                                    x2={`${p2.x}%`} y2={`${p2.y}%`}
                                    className="stroke-amber-100/20"
                                    strokeWidth="1"
                                >
                                    <animate attributeName="stroke-opacity" values="0.1;0.5;0.1" dur={`${3 + (i % 3)}s`} repeatCount="indefinite" />
                                </line>
                            );
                        })}
                    </svg>

                    {/* B. NODES (Sephirot) */}
                    {[
                        { x: 50, y: 90, scale: 1.2 },  // 1. Origine
                        { x: 20, y: 72, scale: 1.0 },  // 2. Library
                        { x: 50, y: 72, scale: 1.0 },  // 3. Workshop
                        { x: 80, y: 72, scale: 1.0 },  // 4. Echo
                        { x: 20, y: 48, scale: 1.1 },  // 5. Fortress
                        { x: 50, y: 48, scale: 1.1 },  // 6. Sanctuary
                        { x: 80, y: 48, scale: 1.1 },  // 7. Value
                        { x: 35, y: 25, scale: 1.1 },  // 8. Time
                        { x: 65, y: 25, scale: 1.1 },  // 9. Loyalty
                        { x: 50, y: 8, scale: 1.3 }    // 10. Mastery
                    ].map((node, i) => (
                        <div
                            key={`tree-node-${i}`}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        >
                            {/* The Node Visual */}
                            <div className="relative w-3 h-3 flex items-center justify-center">
                                {/* Pulse Ring */}
                                <div className="absolute inset-0 -m-2 rounded-full border border-amber-500/0 animate-ping opacity-20 bg-amber-400/10"></div>
                                {/* Core */}
                                <div className="w-full h-full bg-amber-100 rounded-full shadow-[0_0_10px_#fbbf24] animate-pulse"></div>
                                {/* Tiny Number */}
                                <div className="absolute -top-4 text-[8px] text-amber-200/50 font-mono">{i + 1}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ENHANCED Shooting Stars (More frequent + brighter tails + Higher Density) */}
                {Array.from({ length: 15 }).map((_, i) => (
                    <div
                        key={`shooting-star-real-${i}`}
                        className="absolute animate-[shoot_3s_infinite]"
                        style={{
                            top: `${Math.random() * 60}%`, // Concentrated slightly higher
                            left: `${Math.random() * 50}%`,
                            animationDelay: `${Math.random() * 4}s`,
                            opacity: 0
                        }}
                    >
                        {/* The Head (Star) */}
                        <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_15px_white] absolute top-0 left-0 z-10"></div>
                        {/* The Tail (Trail - Longer & Golden) */}
                        <div className="w-[200px] h-[2px] bg-gradient-to-l from-transparent via-amber-200 to-white absolute top-0 right-0 transform origin-right -rotate-0"></div>
                    </div>
                ))}
            </div>

            {/* 2. PODCAST MASTER ATMOSPHERE (Right Hover) - The "Alive Crystal System" */}
            <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${activeHemisphere === 'right' ? 'opacity-100' : 'opacity-0'}`}>

                {/* Central Glow - Living Golden Breath */}
                <div className="absolute top-1/2 right-[25%] transform translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[80px] animate-[pulse_6s_infinite]"></div>

                {/* Concentric Orbits - ALIVE CHAMPAGNE GOLD */}
                <div className="absolute top-1/2 right-[25%] transform translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] flex items-center justify-center">
                    {Array.from({ length: 10 }).map((_, i) => {
                        // REPLICATING PODCAST HUB PHYSICS
                        // Duration: Keystone Slowdown (45s - 100s)
                        const duration = 45 + (i * 6);
                        const isReverse = false; // Unified Vortex Flow

                        return (
                            <div
                                key={`solar-system-${i}`}
                                className={`absolute rounded-full border border-amber-100/10 shadow-[0_0_15px_rgba(251,191,36,0.05)_inset]`}
                                style={{
                                    width: `${15 + i * 8.5}%`, // Adjusted for 10 orbits fitting in 800px
                                    height: `${15 + i * 8.5}%`,
                                    animation: `spin ${duration}s linear infinite ${isReverse ? 'reverse' : 'normal'}`,
                                    opacity: 0.8
                                }}
                            >
                                {/* THE NODE CONTAINER - Counter-Rotating to keep orientation */}
                                <div
                                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center"
                                    style={{
                                        animation: `spin ${duration}s linear infinite ${isReverse ? 'normal' : 'reverse'}`
                                    }}
                                >
                                    {/* ECLIPSE INTERFERENCE LAYER (Moon Frequency) */}
                                    <div
                                        className="absolute inset-0 flex items-center justify-center"
                                        style={{
                                            animation: `eclipse-interference ${15 + (i % 4) * 5}s infinite linear`, // Moon Period
                                        }}
                                    >
                                        {/* Pulse Ring - Sun Synced */}
                                        <div
                                            className="absolute inset-0 -m-4 bg-amber-100 rounded-full animate-ping opacity-20"
                                            style={{
                                                animationDuration: `${8 + (i % 3) * 3}s` // Sun Period
                                            }}
                                        ></div>
                                    </div>

                                    {/* MINI SOLAR SYSTEM (Sub-Orbits) */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        {/* Mini Sun (Gold) */}
                                        <div
                                            className="absolute rounded-full animate-[spin_3s_linear_infinite]"
                                            style={{ width: '160%', height: '160%', animationDuration: `${8 + (i % 3) * 3}s` }}
                                        >
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,1)]"></div>
                                        </div>
                                        {/* Mini Moon (Silver) */}
                                        <div
                                            className="absolute rounded-full animate-[spin_5s_linear_infinite_reverse]"
                                            style={{ width: '220%', height: '220%', animationDuration: `${15 + (i % 4) * 5}s` }}
                                        >
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1 h-1 bg-stone-200 rounded-full"></div>
                                        </div>
                                    </div>

                                    {/* CORE NODE - with Blackout Animation */}
                                    <div
                                        className="w-4 h-4 rounded-full border border-amber-200/60 bg-black/80 flex items-center justify-center text-[8px] text-amber-100 font-mono font-bold shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                                        style={{
                                            // ECLIPSE BLACKOUT LOGIC
                                            animation: `eclipse-interference ${15 + (i % 4) * 5}s infinite linear`
                                        }}
                                    >
                                        {(i + 1).toString().padStart(2, '0')}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 2. CENTRAL PORTAL (The Ascension Pillar) */}
            <div className="absolute z-10 top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-[2px] flex items-center justify-center">

                {/* MILKY WAY (VIA LATTEA) - PURE STAR FIELD (No Fog) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[1200px] pointer-events-none transform rotate-[30deg]">

                    {/* Dense Core Stars */}
                    {Array.from({ length: 40 }).map((_, i) => (
                        <div
                            key={`mw-core-${i}`}
                            className="absolute rounded-full bg-indigo-100 animate-[pulse_4s_infinite]"
                            style={{
                                top: `${20 + Math.random() * 60}%`, // Concentrated in middle 60%
                                left: `${40 + Math.random() * 20}%`, // Narrow band width
                                width: Math.random() < 0.2 ? '2px' : '1px',
                                height: Math.random() < 0.2 ? '2px' : '1px',
                                opacity: 0.3 + Math.random() * 0.5,
                                animationDelay: `${Math.random() * 5}s`
                            }}
                        />
                    ))}

                    {/* Scattered Outer Stars */}
                    {Array.from({ length: 60 }).map((_, i) => (
                        <div
                            key={`mw-outer-${i}`}
                            className="absolute rounded-full bg-white animate-[twinkle_6s_infinite]"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${20 + Math.random() * 60}%`, // Wider band
                                width: '1px',
                                height: '1px',
                                opacity: 0.2 + Math.random() * 0.3,
                                animationDelay: `${Math.random() * 5}s`
                            }}
                        />
                    ))}

                    {/* A few Rare Golden Giants */}
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={`mw-gold-${i}`}
                            className="absolute rounded-full bg-amber-200 shadow-[0_0_2px_amber] animate-pulse"
                            style={{
                                top: `${30 + Math.random() * 40}%`,
                                left: `${45 + Math.random() * 10}%`,
                                width: '2px',
                                height: '2px',
                                opacity: 0.6,
                                animationDelay: `${Math.random() * 3}s`
                            }}
                        />
                    ))}
                </div>

                {/* divine vertical beam */}
                <div className={`absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-amber-100 to-transparent shadow-[0_0_20px_white] transition-all duration-700 ${activeHemisphere ? 'h-full opacity-100' : 'h-[60%] opacity-50'}`}></div>

                {/* The Core Container */}
                <div className="relative flex items-center justify-center">
                    {/* Gyroscope Rings (3D feel) */}
                    {/* Gyroscope Rings (3D feel) */}
                    {/* OUTER RING: GOLDEN (With Mini Sun) - Slowed to 60s */}
                    <div className={`absolute w-[60vmin] h-[60vmin] rounded-full border border-amber-500/30 animate-[spin_60s_linear_infinite] transition-all duration-700 ${activeHemisphere === 'left' ? 'border-amber-400' : (activeHemisphere === 'right' ? 'border-amber-100' : '')}`}>
                        {/* The Mini Sun - Orbiting */}
                        <div className="absolute top-0 left-1/2 w-6 h-6 bg-amber-400 rounded-full shadow-[0_0_25px_#fbbf24] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                            <div className="absolute inset-0 bg-white/80 blur-[2px] rounded-full animate-pulse"></div>
                            <div className="absolute inset-[-4px] bg-amber-500/40 blur-md rounded-full"></div>
                        </div>
                    </div>

                    {/* INNER RING: WHITE (With Mini Moon) - Slowed to 45s */}
                    <div className="absolute w-[45vmin] h-[45vmin] rounded-full border border-white/20 animate-[spin_45s_linear_infinite_reverse]">
                        {/* The Mini Moon - Orbiting */}
                        <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_white] transform -translate-x-1/2 translate-y-1/2 flex items-center justify-center">
                            <div className="absolute inset-0 bg-indigo-100/50 blur-[1px] rounded-full"></div>
                        </div>
                    </div>

                    {/* Vertical Ellipse (The Gate) */}
                    <div className="absolute w-[10vmin] h-[50vmin] rounded-[100%] border border-amber-200/20 animate-[pulse_4s_infinite]"></div>

                    {/* The Entity (Vox Lux Hexagon Logo) - ALIVE HEARTBEAT */}
                    <div className={`relative z-20 transition-all duration-500 transform ${activeHemisphere ? 'scale-125' : 'scale-100'}`}>
                        {/* Back glow - Constrained TIGHT Halo (Logo Only) */}
                        <div className={`absolute inset-10 blur-md transition-colors duration-500 ${activeHemisphere === 'left' ? 'bg-amber-500/10' : (activeHemisphere === 'right' ? 'bg-amber-100/10' : 'bg-white/5')}`}></div>

                        {/* The Custom Logo with "Life" Heartbeat - SLOWED BREATH */}
                        <div className="relative animate-[heartbeat_8s_infinite]">
                            <VoxLuxLogo
                                className="w-32 h-32"
                                primaryColor={activeHemisphere === 'left' ? '#fbbf24' : (activeHemisphere === 'right' ? '#ffffff' : '#e2e8f0')} // Hexagon: Gold vs White
                                secondaryColor={activeHemisphere === 'left' ? '#f59e0b' : (activeHemisphere === 'right' ? '#fde68a' : '#cbd5e1')} // Star: Darker Gold vs Pale Gold
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. DUAL HEMISPHERES */}
            <div className="absolute inset-0 z-20 flex flex-col lg:flex-row">

                {/* LEFT: STORYTELLING MASTER (THE SUN - GOLDEN CRYSTAL) */}
                <div
                    className={`flex-1 flex flex-col items-center justify-center transition-all duration-500 cursor-pointer group px-4 lg:px-12 pb-24 lg:pb-0 ${activeHemisphere === 'right' ? 'opacity-20 blur-sm scale-95' : 'opacity-100'}`}
                    onMouseEnter={() => {
                        setActiveHemisphere('left');
                        playSound('hover');
                    }}
                    onMouseLeave={() => setActiveHemisphere(null)}
                    onClick={() => {
                        playSound('click');
                        onSelectCourse('matrice-1');
                    }}
                >
                    <div className="relative z-10 text-center transform group-hover:-translate-y-2 transition-transform duration-700 ease-out">

                        {/* TITLE: STORYTELLING MASTERMIND - LUXURY REFINEMENT */}
                        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-200 to-amber-500 group-hover:from-white group-hover:via-amber-100 group-hover:to-amber-300 transition-all duration-700 drop-shadow-md mb-1">
                            <span className="block font-light uppercase tracking-[0.3em]">Storytelling</span>
                        </h2>
                        <h3 className="font-serif font-bold italic tracking-widest text-xl md:text-2xl text-amber-100/90 group-hover:text-white transition-colors duration-700">
                            MasterMind
                        </h3>

                        <div className="h-[1px] w-24 group-hover:w-48 bg-gradient-to-r from-transparent via-amber-400 to-transparent transition-all duration-700 mx-auto mt-4 opacity-50"></div>
                    </div>
                </div>

                {/* RIGHT: PODCAST MASTER (THE MOON - CRYSTAL GOLD ALIVE) */}
                <div
                    className={`flex-1 flex flex-col items-center justify-center transition-all duration-700 cursor-pointer group px-4 lg:px-12 pt-24 lg:pt-0 ${activeHemisphere === 'left' ? 'opacity-20 blur-sm scale-95' : 'opacity-100'}`}
                    onMouseEnter={() => {
                        setActiveHemisphere('right');
                        playSound('hover');
                    }}
                    onMouseLeave={() => setActiveHemisphere(null)}
                    onClick={() => {
                        playSound('click');
                        onSelectCourse('matrice-2');
                    }}
                >
                    <div className="relative z-10 text-center transform group-hover:-translate-y-2 transition-transform duration-700 ease-out">

                        {/* TITLE: PODCAST MASTERMIND - LUXURY REFINEMENT */}
                        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-b from-stone-100 via-stone-200 to-stone-400 group-hover:from-white group-hover:via-stone-100 group-hover:to-stone-300 transition-all duration-700 drop-shadow-md mb-1">
                            <span className="block font-light uppercase tracking-[0.3em]">Podcast</span>
                        </h2>
                        <h3 className="font-serif font-bold italic tracking-widest text-xl md:text-2xl text-stone-200/90 group-hover:text-white transition-colors duration-700">
                            MasterMind
                        </h3>

                        {/* Underline - Pulse Silver */}
                        <div className="h-[1px] w-24 group-hover:w-48 bg-gradient-to-r from-transparent via-stone-300 to-transparent transition-all duration-700 mx-auto mt-4 opacity-50 shadow-[0_0_10px_white]"></div>
                    </div>
                </div>

            </div>

            {/* 4. BONUS RELICS (Bottom) - UNLOCKED STRATEGIC ARSENAL */}
            <div className="absolute bottom-12 z-30 flex gap-12 pointer-events-auto">
                {[
                    { label: 'Vox Hypnotica', icon: Brain, color: 'text-purple-400' },
                    { label: 'Oracolo AI', icon: Sparkles, color: 'text-amber-300' },
                    { label: 'High-Ticket', icon: Gem, color: 'text-emerald-400' }
                ].map((item, idx) => (
                    <div
                        key={idx}
                        className="group flex flex-col items-center gap-3 cursor-pointer"
                        onMouseEnter={() => playSound('hover')}
                        onClick={() => playSound('click')}
                    >
                        {/* Orb Container */}
                        <div className="relative w-14 h-14">
                            {/* Rotating Ring */}
                            <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-amber-400/50 transition-colors duration-500 group-hover:rotate-180 ease-out"></div>

                            {/* Inner Orb */}
                            <div className="absolute inset-1 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/5 group-hover:border-white/30 group-hover:bg-white/5 transition-all duration-500 group-hover:scale-110">
                                <item.icon className={`w-6 h-6 ${item.color} opacity-70 group-hover:opacity-100 group-hover:drop-shadow-[0_0_15px_currentColor] transition-all duration-300`} />
                            </div>

                            {/* Glow on Hover */}
                            <div className="absolute inset-0 rounded-full bg-amber-400/0 group-hover:bg-current opacity-20 blur-xl transition-all duration-500" style={{ color: item.color.replace('text-', '') }}></div>
                        </div>

                        {/* Label */}
                        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 group-hover:text-white transition-colors font-medium relative top-1">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* HEADER */}
            <div className="absolute top-8 w-full text-center z-30 pointer-events-none">
                <div className="inline-flex items-center gap-2 text-white/30 text-xs uppercase tracking-[0.3em] border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                    <Zap className="w-3 h-3 text-amber-500" />
                    Ascension Box
                    <Zap className="w-3 h-3 text-cyan-500" />
                </div>
            </div>

            <style jsx>{`
                @keyframes shoot {
                    0% { transform: translate(0, 0) rotate(45deg) scale(0.5); opacity: 0; }
                    10% { opacity: 1; transform: translate(20px, 20px) rotate(45deg) scale(1); }
                    100% { transform: translate(300px, 300px) rotate(45deg) scale(1); opacity: 0; }
                }
                @keyframes heartbeat {
                    0% { transform: scale(1); filter: brightness(1) drop-shadow(0 0 0px rgba(251,191,36,0)); }
                    50% { transform: scale(1.02); filter: brightness(1.1) drop-shadow(0 0 15px rgba(251,191,36,0.6)); }
                    100% { transform: scale(1); filter: brightness(1) drop-shadow(0 0 0px rgba(251,191,36,0)); }
                }

                @keyframes eclipse-interference {
                    0%, 30% { opacity: 1; filter: brightness(1) drop-shadow(0 0 10px rgba(251,191,36,0.5)); }
                    35%, 65% { 
                        background-color: #000000 !important; 
                        border-color: #000000 !important; 
                        color: transparent !important; 
                        box-shadow: none !important;
                        opacity: 0.2; 
                    }
                    70%, 100% { opacity: 1; filter: brightness(1) drop-shadow(0 0 10px rgba(251,191,36,0.5)); }
                }
            `}</style>
        </div>
    );
};
