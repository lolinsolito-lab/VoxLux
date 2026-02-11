import React, { useState, useEffect, useRef } from 'react';
import { COURSES } from '../services/courseData';
import { ArrowLeft, Crown, Zap, Hexagon, Lock, Play, Box, Activity, Mic, Sparkles, Shield } from 'lucide-react';

interface AscensionViewProps {
   onBack: () => void;
}

export const AscensionView: React.FC<AscensionViewProps> = ({ onBack }) => {
   const [introFinished, setIntroFinished] = useState(false);
   const [activeBonus, setActiveBonus] = useState<string | null>(null);

   // Audio Context for the "Ritual" Sound Design
   const audioContextRef = useRef<AudioContext | null>(null);

   const initAudio = () => {
      if (!audioContextRef.current) {
         const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
         audioContextRef.current = new AudioContextClass();
      }
   };

   const playRitualSound = (type: 'hover' | 'open' | 'bonus') => {
      initAudio();
      const ctx = audioContextRef.current;
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Low pass filter for "muffled" underwater/void effect
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'hover') {
         // Subtle low thrum
         osc.type = 'sine';
         osc.frequency.setValueAtTime(60, now);
         osc.frequency.linearRampToValueAtTime(80, now + 0.1);
         gain.gain.setValueAtTime(0.05, now);
         gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
         osc.start();
         osc.stop(now + 0.3);
      } else if (type === 'open') {
         // Majestic opening chord (simulated)
         osc.type = 'triangle';
         osc.frequency.setValueAtTime(110, now); // A2
         gain.gain.setValueAtTime(0.1, now);
         gain.gain.exponentialRampToValueAtTime(0.001, now + 2);
         osc.start();
         osc.stop(now + 2);

         // Secondary harmonic
         const osc2 = ctx.createOscillator();
         const gain2 = ctx.createGain();
         osc2.connect(gain2);
         gain2.connect(ctx.destination);
         osc2.type = 'sine';
         osc2.frequency.setValueAtTime(220, now); // A3
         gain2.gain.setValueAtTime(0.05, now);
         gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
         osc2.start();
         osc2.stop(now + 1.5);
      } else if (type === 'bonus') {
         // High glassy chime
         osc.type = 'sine';
         osc.frequency.setValueAtTime(880, now);
         gain.gain.setValueAtTime(0.05, now);
         gain.gain.exponentialRampToValueAtTime(0.001, now + 1);
         osc.start();
         osc.stop(now + 1);
      }
   };

   const startAscension = () => {
      playRitualSound('open');
      setIntroFinished(true);
   };

   if (!introFinished) {
      return (
         <div className="fixed inset-0 z-50 bg-lux-black flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 animate-pulse-slow"></div>
            <div className="particles"></div>

            {/* Lottie-style CSS Animation for the Sigil */}
            <div className="relative mb-12">
               <div className="w-40 h-40 md:w-64 md:h-64 border border-lux-gold/30 rounded-full animate-spin-slow flex items-center justify-center">
                  <div className="w-[90%] h-[90%] border border-lux-gold/50 rounded-full border-dashed animate-spin-reverse-slow"></div>
               </div>
               <div className="absolute inset-0 flex items-center justify-center animate-[zoomIn_1s_ease-out]">
                  <Crown className="w-16 h-16 md:w-24 md:h-24 text-lux-gold drop-shadow-[0_0_20px_rgba(228,197,114,0.6)]" />
               </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-lux-gold via-white to-lux-goldDim mb-4 text-center tracking-widest animate-[slideUp_1s_ease-out_0.5s_both]">
               VOX AUREA ASCENSION
            </h1>

            <p className="text-lux-cyan/60 uppercase tracking-[0.3em] text-xs md:text-sm mb-12 animate-[fadeIn_1s_ease-out_1s_both]">
               Il Forziere Rituale • 60 Moduli • 3 Bonus
            </p>

            <button
               onClick={startAscension}
               onMouseEnter={() => playRitualSound('hover')}
               className="px-12 py-4 bg-gradient-to-r from-lux-goldDim to-lux-gold text-lux-black font-bold uppercase tracking-[0.2em] rounded-sm hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(228,197,114,0.3)] animate-[fadeIn_1s_ease-out_1.5s_both]"
            >
               Sblocca l'Ascensione
            </button>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-lux-black text-gray-200 overflow-y-auto overflow-x-hidden relative">
         {/* Cinematic Background */}
         <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-lux-navy to-lux-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-lux-gold/5 blur-[100px] rounded-full"></div>
         </div>

         {/* Header */}
         <div className="relative z-10 p-8 border-b border-lux-gold/10 bg-lux-black/50 backdrop-blur-sm flex justify-between items-center sticky top-0">
            <div className="flex items-center gap-4">
               <button onClick={onBack} className="text-gray-400 hover:text-lux-gold transition-colors">
                  <ArrowLeft className="w-6 h-6" />
               </button>
               <div>
                  <h1 className="text-xl font-display font-bold text-lux-gold tracking-wide">ASCENSION BOX</h1>
                  <p className="text-[10px] text-lux-cyan uppercase tracking-[0.2em]">The Full Architecture of Influence</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="hidden md:flex items-center gap-2 px-4 py-1 border border-lux-gold/20 rounded-full bg-lux-gold/5">
                  <Crown className="w-3 h-3 text-lux-gold" />
                  <span className="text-xs text-lux-gold font-bold">VIP ACCESS GRANTED</span>
               </div>
            </div>
         </div>

         <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-12">

            {/* Dual Columns + Center Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

               {/* Left Column: Storytelling (Matrice I) */}
               <div className="space-y-6">
                  <div className="text-center mb-8">
                     <Sparkles className="w-8 h-8 text-lux-goldDim mx-auto mb-2" />
                     <h3 className="text-lux-goldDim font-display text-lg">MATRICE I</h3>
                     <p className="text-xs text-gray-500 uppercase tracking-widest">Storytelling Strategy</p>
                  </div>

                  <div className="relative border-l border-lux-gold/10 ml-6 space-y-8 pb-12">
                     {COURSES['matrice-1'].masterminds.map((mm, idx) => (
                        <div key={mm.id} className="relative pl-8 group cursor-pointer">
                           <div className="absolute left-[-5px] top-1 w-2 h-2 bg-lux-goldDim rounded-full group-hover:bg-lux-cyan group-hover:scale-150 transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div>
                           <div className="bg-lux-navy/40 border border-lux-gold/10 p-4 rounded hover:border-lux-gold/50 transition-all hover:bg-lux-navy/60 hover:-translate-y-1" onMouseEnter={() => playRitualSound('hover')}>
                              <h4 className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">Mastermind {idx + 1}</h4>
                              <p className="text-xs text-gray-500 line-clamp-1">{mm.title.split(':')[1] || mm.title}</p>
                              <div className="mt-2 flex gap-1">
                                 {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-lux-gold/20 group-hover:bg-lux-gold transition-colors delay-75"></div>)}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Center Column: The Bonuses (Ascension Core) */}
               <div className="lg:mt-24 space-y-8">
                  <div className="text-center mb-8 relative">
                     <div className="absolute inset-0 bg-lux-gold/10 blur-[40px] rounded-full"></div>
                     <Crown className="w-12 h-12 text-lux-gold mx-auto mb-2 relative z-10 animate-float" />
                     <h3 className="text-lux-gold font-display text-2xl relative z-10">THE TRINITY</h3>
                     <p className="text-xs text-lux-cyan uppercase tracking-widest relative z-10">Exclusive Bonus Content</p>
                  </div>

                  {/* Bonus Cards */}
                  {COURSES['ascension-box'].masterminds.map((bonus) => (
                     <div
                        key={bonus.id}
                        onClick={() => { setActiveBonus(activeBonus === bonus.id ? null : bonus.id); playRitualSound('bonus'); }}
                        className={`relative bg-gradient-to-br from-lux-royal/20 to-lux-black border transition-all duration-500 cursor-pointer overflow-hidden ${activeBonus === bonus.id ? 'border-lux-gold shadow-[0_0_30px_rgba(228,197,114,0.2)] scale-105' : 'border-lux-gold/30 hover:border-lux-cyan/50'}`}
                     >
                        <div className="p-6 relative z-10">
                           <div className="flex items-center gap-4 mb-2">
                              <div className={`p-2 rounded-full border border-lux-gold/20 ${activeBonus === bonus.id ? 'bg-lux-gold text-black' : 'bg-transparent text-lux-gold'}`}>
                                 {bonus.id === 'bonus-1' && <Activity className="w-5 h-5" />}
                                 {bonus.id === 'bonus-2' && <Mic className="w-5 h-5" />}
                                 {bonus.id === 'bonus-3' && <Hexagon className="w-5 h-5" />}
                              </div>
                              <div>
                                 <h4 className={`font-bold font-display uppercase tracking-wide ${activeBonus === bonus.id ? 'text-white' : 'text-gray-300'}`}>{bonus.subtitle}</h4>
                                 <p className="text-[10px] text-lux-cyan uppercase">{bonus.title.split(':')[1]}</p>
                              </div>
                           </div>

                           {/* Expanded Content */}
                           <div className={`transition-all duration-500 overflow-hidden ${activeBonus === bonus.id ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                              <p className="text-sm text-gray-400 mb-4">{bonus.modules[0].description}</p>
                              <button className="w-full py-2 bg-lux-gold/10 border border-lux-gold text-lux-gold text-xs uppercase font-bold tracking-widest hover:bg-lux-gold hover:text-black transition-colors">
                                 Access {bonus.modules[0].duration}
                              </button>
                           </div>
                        </div>
                        {/* Decorative background glow */}
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-lux-gold/5 rounded-full blur-2xl"></div>
                     </div>
                  ))}
               </div>

               {/* Right Column: Podcast (Matrice II) */}
               <div className="space-y-6">
                  <div className="text-center mb-8">
                     <Mic className="w-8 h-8 text-lux-cyan mx-auto mb-2" />
                     <h3 className="text-lux-cyan font-display text-lg">MATRICE II</h3>
                     <p className="text-xs text-gray-500 uppercase tracking-widest">Vox Podcast Master</p>
                  </div>

                  <div className="relative border-l border-lux-cyan/10 ml-6 space-y-8 pb-12">
                     {COURSES['matrice-2'].masterminds.map((mm, idx) => (
                        <div key={mm.id} className="relative pl-8 group cursor-pointer">
                           <div className="absolute left-[-5px] top-1 w-2 h-2 bg-lux-cyan/50 rounded-full group-hover:bg-lux-gold group-hover:scale-150 transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div>
                           <div className="bg-lux-navy/40 border border-lux-cyan/10 p-4 rounded hover:border-lux-cyan/50 transition-all hover:bg-lux-navy/60 hover:-translate-y-1" onMouseEnter={() => playRitualSound('hover')}>
                              <h4 className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">Mastermind {idx + 1}</h4>
                              <p className="text-xs text-gray-500 line-clamp-1">{mm.title.split(':')[1] || mm.title}</p>
                              <div className="mt-2 flex gap-1">
                                 {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-lux-cyan/20 group-hover:bg-lux-cyan transition-colors delay-75"></div>)}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

            </div>

         </div>
      </div>
   );
};