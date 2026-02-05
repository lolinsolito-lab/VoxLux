import React, { useEffect, useState } from 'react';
import { Sparkles, Hexagon, Zap } from 'lucide-react';

interface SplashProps {
  onComplete: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState(0); // 0: Init, 1: Implode, 2: Explode, 3: Reveal, 4: Exit

  const handleStart = () => {
    if (started) return;
    setStarted(true);

    // CINEMATIC TIMELINE START
    // 0s: Start Implosion
    setTimeout(() => setPhase(1), 100);

    // 2s: BIG BANG (Flash)
    setTimeout(() => setPhase(2), 2000);

    // 2.2s: Reveal Logo (Through the smoke)
    setTimeout(() => setPhase(3), 2200);

    // 5s: Exit
    setTimeout(() => setPhase(4), 5000);

    // 6s: Unmount
    setTimeout(onComplete, 6000);
  };

  return (
    <div
      onClick={handleStart}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden transition-all duration-1000 cursor-pointer ${phase === 4 ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}
    >

      {/* 1. DEEP SPACE BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-black to-black"></div>

      {/* Moving Stars */}
      <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 transition-transform duration-[5s] ease-in ${phase >= 2 ? 'scale-150' : 'scale-100'}`}></div>

      {/* ==================================================================================
          PHASE 0: WAITING FOR USER (Immersive Entry)
         ================================================================================== */}
      {!started && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/40 backdrop-blur-sm transition-all duration-700">

          {/* Brand Header */}
          <div className="mb-12 text-center animate-[fadeIn_1s_ease-out]">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-lux-gold via-lux-goldDim to-lux-goldDark drop-shadow-2xl mb-4 tracking-widest">
              VOX LUX STRATEGY
            </h2>
            <p className="text-xs md:text-sm text-blue-200/60 font-serif italic tracking-[0.2em]">
              "HUMAN VOICE MASTERY & AI STORYTELLING"
            </p>
          </div>

          {/* Pulsing Border Container */}
          <div className="relative group cursor-pointer" onClick={handleStart}>

            {/* Animated Rings */}
            <div className="absolute -inset-8 bg-gradient-to-r from-lux-gold/0 via-lux-gold/30 to-lux-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 duration-500 animate-[spin_4s_linear_infinite]"></div>



            <button
              className="relative px-12 py-4 bg-black/80 border border-lux-gold/30 text-lux-gold font-display font-bold tracking-[0.3em] uppercase text-sm hover:bg-lux-gold hover:text-black transition-all duration-500 shadow-[0_0_30px_rgba(250,204,21,0.1)] group-hover:shadow-[0_0_50px_rgba(250,204,21,0.4)] group-hover:scale-105"
            >
              Enter Experience
            </button>

            {/* Decorative Lines */}
            <div className="absolute top-1/2 left-0 w-8 h-[1px] bg-lux-gold/50 -translate-x-full transition-all group-hover:-translate-x-[150%]"></div>
            <div className="absolute top-1/2 right-0 w-8 h-[1px] bg-lux-gold/50 translate-x-full transition-all group-hover:translate-x-[150%]"></div>
          </div>

          <p className="mt-8 text-[10px] text-gray-500 uppercase tracking-[0.2em] animate-pulse">
            Audio & Visual Immersion
          </p>
        </div>
      )}

      {/* ==================================================================================
          PHASE 1: THE IMPLOSION (Gathering Energy)
         ================================================================================== */}
      <div className={`absolute transition-all duration-500 ${phase >= 2 || !started ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>
        <div className="w-[600px] h-[600px] rounded-full border border-indigo-500/10 animate-[spin_4s_linear_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-indigo-500/20 animate-[spin_3s_linear_infinite_reverse]"></div>
        {/* Particles sucking in */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400 animate-pulse tracking-[1em] text-xs font-mono opacity-50 text-center w-full">INITIALIZING INSOLITO EXPERIENCE...</div>
      </div>

      {/* ==================================================================================
          PHASE 2: THE BIG BANG (Flash)
         ================================================================================== */}
      <div className={`absolute inset-0 bg-white z-50 pointer-events-none mix-blend-overlay transition-opacity duration-1000 ease-out ${phase === 2 ? 'opacity-100' : 'opacity-0'}`}></div>
      {/* Shockwave Ring */}
      <div className={`absolute border-4 border-white rounded-full transition-all duration-1000 ease-out ${phase >= 2 ? 'w-[200vw] h-[200vw] opacity-0 border-[0px]' : 'w-0 h-0 opacity-100'}`}></div>

      {/* ==================================================================================
          PHASE 3: THE REVELATION (Logo + God Rays + COSMIC LIFE)
         ================================================================================== */}
      <div className={`relative z-10 flex flex-col items-center justify-center transition-all duration-1000 transform ${phase >= 3 ? 'scale-100 opacity-100 blur-0' : 'scale-50 opacity-0 blur-xl'}`}>

        {/* SHOOTING STARS (Passing) */}
        <div className="absolute top-[-20%] left-[-20%] w-[150%] h-full -rotate-45 pointer-events-none">
          <div className="absolute top-[30%] left-[-10%] w-[40%] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent animate-[shoot_3s_ease-in-out_infinite_2s]"></div>
          <div className="absolute top-[60%] left-[-10%] w-[30%] h-[1px] bg-gradient-to-r from-transparent via-cyan-200 to-transparent animate-[shoot_4s_ease-in-out_infinite_1s]"></div>
        </div>

        {/* PASSING ORBITS (Large Rings) */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[800px] h-[800px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite] absolute"></div>
          <div className="w-[600px] h-[600px] border border-white/10 rounded-full animate-[spin_40s_linear_infinite_reverse] absolute border-dashed opacity-30"></div>
        </div>

        {/* GOD RAYS (Rotating Behind) */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-transparent via-amber-500/10 to-transparent w-[1px] h-[500px] left-1/2 -translate-x-1/2 rotate-45"></div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-transparent via-amber-500/10 to-transparent w-[1px] h-[500px] left-1/2 -translate-x-1/2 -rotate-45"></div>

        {/* Rotating Halo */}
        <div className="absolute w-[300px] h-[300px] bg-[conic-gradient(from_0deg,transparent_0_300deg,#f59e0b_360deg)] opacity-20 animate-[spin_10s_linear_infinite] rounded-full blur-2xl"></div>

        {/* LOGO ICON */}
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-amber-500/30 blur-2xl animate-pulse"></div>
          <Hexagon className="w-24 h-24 text-white fill-amber-500/10 stroke-[1.5] drop-shadow-[0_0_20px_rgba(245,158,11,0.8)] animate-float" />
          <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-amber-200 animate-pulse" />
        </div>

        {/* TEXT REVEAL */}
        <div className="text-center overflow-hidden">
          <h1 className="text-6xl md:text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-500 drop-shadow-2xl tracking-widest animate-[tracking_3s_ease-out_forwards]">
            VOX LUX
          </h1>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-6 mb-4 animate-[expandLine_2s_ease-out_forwards]"></div>
          <p className="text-sm md:text-lg text-cyan-200/80 uppercase tracking-[0.6em] font-light animate-[fadeIn_2s_ease-out_1s_both]">
            Domina l'Arte dell'Ascolto
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes tracking {
          0% { letter-spacing: -0.5em; opacity: 0; }
          40% { opacity: 1; }
          100% { letter-spacing: 0.2em; opacity: 1; }
        }
        @keyframes expandLine {
          0% { width: 0%; opacity: 0; }
          50% { width: 50%; opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        @keyframes shoot {
            0% { transform: translateX(0) translateY(0) scale(1); opacity: 0; }
            10% { opacity: 1; }
            100% { transform: translateX(500px) translateY(500px) scale(0.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};