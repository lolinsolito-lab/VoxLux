import React from 'react';
import { Box, Zap, Crown, ArrowRight } from 'lucide-react';

interface AscensionCardProps {
    onEnter: (id: string) => void;
    onHover?: () => void;
    isDesktop?: boolean;
}

export const AscensionCard: React.FC<AscensionCardProps> = ({ onEnter, onHover, isDesktop = false }) => {
    const content = (
        <div className="relative z-10 p-6 w-full flex flex-col items-center h-full justify-center">
            <div className={`w-24 h-24 rounded-full border-2 border-indigo-400/30 flex items-center justify-center bg-indigo-950/60 mb-4 ${isDesktop ? 'group-hover:border-white group-hover:rotate-180 transition-all duration-700 shadow-[0_0_40px_rgba(99,102,241,0.5)]' : 'shadow-[0_0_60px_rgba(99,102,241,0.7)]'} mt-4`}>
                <Box className={`w-12 h-12 ${isDesktop ? 'text-indigo-300 group-hover:text-white' : 'text-white animate-pulse'}`} />
            </div>

            <h3 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-100 to-indigo-500 mb-1 drop-shadow-[0_0_30px_rgba(99,102,241,1)]">ASCENSION</h3>
            <p className="text-xs uppercase tracking-[0.5em] text-indigo-300 mb-6 font-bold border-b border-indigo-500/50 pb-2">Il Percorso Completo</p>

            {/* Core Access */}
            <div className={`space-y-2.5 w-full text-left pl-6 mb-4 ${isDesktop ? 'opacity-80 group-hover:opacity-100 transition-opacity' : 'opacity-100'} border-l-2 border-indigo-500/50 ml-4`}>
                <div className="flex items-center gap-3 text-xs text-indigo-100 font-medium">⚛️ ACCESSO COMPLETO (Storytelling + Podcast)</div>
                <div className="flex items-center gap-3 text-xs text-indigo-100 font-medium">🔱 20 Moduli Completi (10+10)</div>
                <div className="flex items-center gap-3 text-xs text-indigo-100 font-medium">💎 2x Certificati Digitali + QR</div>
                <div className="flex items-center gap-3 text-xs text-indigo-100 font-medium">👑 Community Privata (Accesso a Vita)</div>
            </div>

            {/* Divider */}
            <div className="w-[80%] h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent my-3" />

            {/* Bonus Section */}
            <div className="w-full px-6 mb-4">
                <p className="text-xs font-bold text-indigo-200 mb-2.5 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    7 BONUS INCLUSI:
                </p>
                <div className="space-y-1.5 text-[11px] text-indigo-200/70 pl-5">
                    <p>📄 Swipe Files Pro Edition</p>
                    <p>🔥 Framework Viralità Garantita</p>
                    <p>📚 Template Storytelling Esclusivi</p>
                    <p>🎙️ Masterclass: AI Voice Cloning</p>
                    <p>📝 10 Script AI Podcast</p>
                    <p>🎧 Audio Branding Toolkit</p>
                    <p className="text-emerald-300/80 font-semibold">⭐ Bonus Esclusivo Ascension</p>
                </div>
            </div>

            {/* Divider */}
            <div className="w-[80%] h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent mb-4" />

            <div className="mb-4 flex flex-col items-center">
                <span className="text-white text-4xl font-bold drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]">€997</span>
                <span className="text-indigo-300 text-sm line-through mt-1">€1.994</span>
                <span className="text-emerald-400 text-xs font-bold mt-1.5 uppercase tracking-wide animate-pulse">RISPARMIO 50%</span>
            </div>

            <button className={`w-full py-4 bg-white text-black text-sm tracking-[0.3em] font-bold uppercase flex items-center justify-center gap-3 rounded-md shadow-[0_0_50px_white] mb-4 ${isDesktop ? 'hover:bg-indigo-100 hover:shadow-[0_0_60px_white]' : 'hover:scale-105'} transition-all`}>
                {isDesktop ? "OTTIENI TUTTO AL MIGLIOR PREZZO" : "Scopri l'Offerta"} <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );

    const containerClasses = isDesktop
        ? "z-20 relative -mt-8 mb-8 rounded-xl overflow-hidden flex flex-col items-center justify-center text-center transition-all duration-700 hover:scale-110 cursor-pointer border border-indigo-500/30 hover:border-white bg-black shadow-[0_0_50px_rgba(79,70,229,0.3)] hover:shadow-[0_0_100px_rgba(99,102,241,0.8)]"
        : "z-20 relative w-full max-w-[360px] mx-auto min-h-[580px] rounded-3xl overflow-hidden flex flex-col justify-center items-center text-center transition-all duration-700 cursor-pointer border border-indigo-400/60 bg-black shadow-[0_0_80px_rgba(99,102,241,0.4)] scale-105 my-8";

    return (
        <div
            onClick={() => onEnter('ascension-box')}
            onMouseEnter={onHover}
            className={containerClasses}
        >
            {/* HYPERSPACE EFFECT */}
            <div className={`absolute inset-0 ${isDesktop ? 'opacity-60 group-hover:opacity-100' : 'opacity-100'} transition-opacity`}>
                <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,#6366f1_360deg)] animate-[spin_5s_linear_infinite] opacity-60"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950 via-black to-black"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-100 animate-[ping_3s_infinite]"></div>
            </div>

            <div className="absolute top-0 right-0 p-6 z-30">
                <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-black text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-[0_0_20px_rgba(52,211,153,0.6)] animate-pulse border border-white/50">Best Value</div>
            </div>

            {content}
        </div>
    );
};
