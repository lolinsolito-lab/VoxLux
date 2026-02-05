import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mic, Box, ArrowRight, Crown, Zap, Unlock, ChevronDown, Lock, X, LogIn } from 'lucide-react';
import { useAudioSystem } from '../hooks/useAudioSystem';
import { useAuth } from '../contexts/AuthContext';

interface HeroProps {
  onEnter: (courseId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onEnter }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const { playSound } = useAudioSystem();

  const playHoverSound = useCallback(() => {
    playSound('hover');
  }, [playSound]);

  const cardBaseClass = "group relative rounded-sm overflow-hidden flex flex-col transition-all duration-500 ease-out hover:scale-105 hover:shadow-[0_0_50px_rgba(79,212,208,0.2)] cursor-pointer border border-lux-goldDark hover:border-lux-cyan bg-lux-navy/80 backdrop-blur-md";

  const scrollToContent = () => {
    const content = document.getElementById('mobile-content');
    if (content) {
      content.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-lux-black text-gray-200 relative">

      {/* =====================================================================================
          NAVIGATION BAR (Fixed Top)
         ===================================================================================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm">
        {/* Logo / Brand (Mobile Only - Desktop has big title centered) */}
        <div className="flex items-center gap-2 lg:hidden">
          <Crown className="w-6 h-6 text-lux-gold" />
          <span className="text-lux-gold font-display font-bold tracking-widest text-sm">VOX LUX</span>
        </div>

        {/* Desktop Placeholder (Invisible) to balance flex */}
        <div className="hidden lg:block w-20"></div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-6 py-2 bg-lux-gold text-lux-black text-xs uppercase tracking-widest font-bold rounded hover:bg-white transition-all shadow-[0_0_20px_rgba(250,204,21,0.4)]"
            >
              <Crown className="w-4 h-4" /> Vai alla Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-lux-gold transition-colors font-bold"
              >
                <LogIn className="w-4 h-4" /> <span className="hidden sm:inline">Accedi</span>
              </button>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-4 py-2 bg-lux-gold/10 border border-lux-gold/30 text-lux-gold text-xs uppercase tracking-widest font-bold rounded hover:bg-lux-gold/20 hover:border-lux-gold transition-all shadow-[0_0_15px_rgba(250,204,21,0.1)]"
              >
                Inizia Ora
              </button>
            </>
          )}
        </div>
      </nav>

      {/* =====================================================================================
          REGISTER MODAL (Purchase Required)
         ===================================================================================== */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setShowRegisterModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-lux-black border border-lux-gold/30 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(250,204,21,0.2)] animate-[zoomIn_0.3s_ease-out]">
            <button
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-lux-gold/10 flex items-center justify-center mx-auto mb-6 border border-lux-gold/30">
                <Lock className="w-8 h-8 text-lux-gold" />
              </div>

              <h3 className="text-2xl font-display font-bold text-white mb-2">Accesso Riservato</h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                L'iscrizione a Vox Lux è possibile solo tramite <strong>Invito</strong> o <strong>Chiave di Accesso</strong> (acquisto di una Matrice).
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowRegisterModal(false);
                    scrollToContent(); // Scroll to pricing
                  }}
                  className="w-full py-3 bg-lux-gold text-black font-bold uppercase tracking-widest text-sm rounded hover:bg-yellow-400 transition-colors shadow-[0_0_20px_rgba(250,204,21,0.4)]"
                >
                  Acquista una Chiave
                </button>

                <button
                  onClick={() => {
                    setShowRegisterModal(false);
                    navigate('/login');
                  }}
                  className="w-full py-3 bg-transparent border border-gray-700 text-gray-400 font-bold uppercase tracking-widest text-sm rounded hover:border-white hover:text-white transition-colors"
                >
                  Ho già un account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cinematic Background - "The Alive Void" */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-black"></div>
        {/* Dynamic Nebulas */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-900/20 rounded-full blur-[120px] animate-[pulse_8s_infinite]"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-fuchsia-900/10 rounded-full blur-[120px] animate-[pulse_10s_infinite_reverse]"></div>
        <div className="absolute top-[20%] right-[20%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[100px] animate-[spin_20s_linear_infinite]"></div>

        {/* Moving Stardust */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 animate-[spin_60s_linear_infinite]"></div>

        {/* Shooting Stars Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0)_0%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0)_100%)] w-[200%] h-full animate-[drift_15s_linear_infinite] opacity-10 transform -skew-x-12"></div>
      </div>

      {/* =====================================================================================
          MOBILE & TABLET VIEW (< 1024px)
          Vertical Scroll Layout with Hero Message
         ===================================================================================== */}
      <div className="lg:hidden absolute inset-0 overflow-y-auto">

        {/* Hero Message Section - Full Screen */}
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block mb-6 animate-float">
              <Crown className="w-16 h-16 md:w-20 md:h-20 text-lux-gold drop-shadow-[0_0_20px_rgba(228,197,114,0.6)]" />
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-lux-gold via-lux-goldDim to-lux-goldDark drop-shadow-2xl mb-6">
              VOX LUX STRATEGY
            </h1>
            <p className="text-xl md:text-2xl text-blue-200/70 font-serif italic tracking-wide mb-12">
              "Il portale per l'ascensione neuro-digitale."
            </p>
            <div className="max-w-2xl mx-auto mb-12 space-y-4">
              <p className="text-lg text-gray-300 leading-relaxed">
                Benvenuto nell'universo dell'<span className="text-lux-cyan font-bold">Influenza Vocale Strategica</span>.
              </p>
            </div>
            <button
              onClick={scrollToContent}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-lux-goldDim to-lux-gold text-lux-black text-sm tracking-[0.15em] font-bold uppercase hover:brightness-110 transition-all shadow-[0_0_30px_rgba(228,197,114,0.4)] rounded-sm"
            >
              Esplora le Matrici
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </button>
          </div>
        </div>

        {/* Courses Section - Vertical Stack with "Breathing Room" */}
        <div id="mobile-content" className="w-full px-6 py-24 space-y-20">

          {/* CARD 1: MATRICE I (THE SUN) - Portrait Optimization */}
          <div
            onClick={() => onEnter('matrice-1')}
            className="relative w-full max-w-[340px] mx-auto min-h-[520px] rounded-2xl overflow-hidden flex flex-col justify-center items-center text-center border border-yellow-500/50 bg-lux-navy/80 backdrop-blur-xl shadow-[0_0_40px_rgba(250,204,21,0.2)]"
          >
            {/* GOLDEN EFFECT (Always Active on Mobile) */}
            <div className="absolute inset-0 opacity-100">
              <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#facc15_360deg)] animate-[spin_10s_linear_infinite] blur-3xl opacity-40"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/40 via-black/80 to-black"></div>
              {/* Floating Gold Dust */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-80 animate-pulse text-yellow-200"></div>
            </div>

            <div className="relative z-10 flex flex-col h-full items-center justify-between py-8 px-4">
              {/* Icon Container with INTENSE PULSE */}
              <div className="w-28 h-28 rounded-full border border-yellow-500/80 flex items-center justify-center bg-yellow-500/10 mb-6 shadow-[0_0_60px_rgba(250,204,21,0.5)] relative overflow-visible mt-4">
                <div className="absolute inset-0 bg-yellow-400/30 blur-2xl animate-[pulse_2s_infinite]"></div>
                <Sparkles className="w-12 h-12 text-yellow-300 relative z-10 animate-[spin_4s_linear_infinite]" />
              </div>

              <div className="flex flex-col items-center">
                <h3 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-50 to-yellow-500 mb-3 drop-shadow-xl leading-tight">STORYTELLING<br />MASTERMIND</h3>
                <p className="text-[10px] uppercase tracking-[0.4em] text-yellow-500 mb-8 font-bold border-b border-yellow-500/30 pb-2">The Sun Archetype</p>

                <p className="text-stone-300 text-sm leading-relaxed mb-8 px-2 font-light">
                  "L'algoritmo perduto della Risonanza Limbica. Una tecnologia narrativa che bypassa la logica e installa la tua autorità direttamente nei centri decisionali del cervello."
                </p>
              </div>

              <button className="w-4/5 py-4 border border-yellow-500/50 text-yellow-500 bg-yellow-500/10 transition-all text-xs tracking-[0.25em] font-bold uppercase flex items-center justify-center gap-2 rounded-sm shadow-[0_0_30px_rgba(250,204,21,0.2)] hover:bg-yellow-500/20 mb-4">
                <Unlock className="w-3 h-3" /> Ignite
              </button>
            </div>
          </div>

          {/* CARD 2: ASCENSION BOX (THE HYPER PORTAL) - Center / Largest */}
          <div
            onClick={() => onEnter('ascension-box')}
            className="z-20 relative w-full max-w-[360px] mx-auto min-h-[580px] rounded-3xl overflow-hidden flex flex-col justify-center items-center text-center transition-all duration-700 cursor-pointer border border-indigo-400/60 bg-black shadow-[0_0_80px_rgba(99,102,241,0.4)] scale-105 my-8"
          >
            {/* HYPERSPACE EFFECT */}
            <div className="absolute inset-0 opacity-100">
              <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,#6366f1_360deg)] animate-[spin_5s_linear_infinite] opacity-60"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950 via-black to-black"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-100 animate-[ping_3s_infinite]"></div>
            </div>

            <div className="absolute top-0 right-0 p-6 z-30">
              <div className="bg-white text-black text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[0_0_20px_white] animate-pulse">Ultimate</div>
            </div>

            <div className="relative z-10 p-6 w-full flex flex-col items-center h-full justify-center">
              <div className="w-32 h-32 rounded-full border-2 border-indigo-400/50 flex items-center justify-center bg-indigo-950/60 mb-6 shadow-[0_0_60px_rgba(99,102,241,0.7)] mt-6">
                <Box className="w-14 h-14 text-white animate-pulse" />
              </div>

              <h3 className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-100 to-indigo-500 mb-2 drop-shadow-[0_0_30px_rgba(99,102,241,1)]">ASCENSION</h3>
              <p className="text-xs uppercase tracking-[0.5em] text-indigo-300 mb-10 font-bold border-b border-indigo-500/50 pb-2">The Singularity</p>

              <div className="space-y-4 w-full text-left pl-8 mb-10 flex-grow opacity-100 border-l-2 border-indigo-500/50 ml-6">
                <div className="flex items-center gap-3 text-sm text-indigo-100 font-medium"><Zap className="w-5 h-5 text-indigo-400" /> Accesso Totale (60 Moduli)</div>
                <div className="flex items-center gap-3 text-sm text-indigo-100 font-medium"><Crown className="w-5 h-5 text-indigo-400" /> 12 Mastermind Esclusive</div>
                <div className="flex items-center gap-3 text-sm text-indigo-100 font-medium"><Zap className="w-5 h-5 text-indigo-400" /> Cripte Vocali Segrete</div>
              </div>

              <button className="w-full py-5 bg-white text-black text-sm tracking-[0.3em] font-bold uppercase flex items-center justify-center gap-3 rounded-md shadow-[0_0_50px_white] mb-6 hover:scale-105 transition-transform">
                Enter Vortex <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CARD 3: MATRICE II (THE MOON) - Portrait Optimization */}
          <div
            onClick={() => onEnter('matrice-2')}
            className="relative w-full max-w-[340px] mx-auto min-h-[520px] rounded-2xl overflow-hidden flex flex-col justify-center items-center text-center border border-stone-500/60 bg-lux-navy/80 backdrop-blur-xl shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            {/* MOON EFFECT - High Visibility */}
            <div className="absolute inset-0 opacity-100">
              {/* Brighter Orbits (White/40) */}
              <div className="absolute top-[5%] left-[5%] w-[90%] h-[90%] border-t-2 border-r-2 border-white/40 rounded-full animate-[spin_10s_linear_infinite] shadow-[0_0_30px_rgba(255,255,255,0.2)]"></div>
              <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] border-b-2 border-l-2 border-white/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-stone-800/70 via-black to-black"></div>
            </div>

            <div className="relative z-10 flex flex-col h-full items-center justify-between py-8 px-4">
              {/* Mic with HEARTBEAT Pulse */}
              <div className="w-28 h-28 rounded-full border border-stone-400/80 flex items-center justify-center bg-white/5 mb-6 shadow-[0_0_50px_rgba(255,255,255,0.3)] relative mt-4">
                {/* Living Breath Animation */}
                <div className="absolute inset-0 rounded-full bg-white/20 animate-[ping_3s_infinite]"></div>
                <Mic className="w-12 h-12 text-white animate-[pulse_2s_infinite] relative z-10" />
              </div>

              <div className="flex flex-col items-center">
                <h3 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-stone-100 to-stone-500 mb-3 drop-shadow-xl leading-tight">PODCAST<br />MASTERMIND</h3>
                <p className="text-[10px] uppercase tracking-[0.4em] text-stone-300 mb-8 font-bold border-b border-stone-500/50 pb-2">The Moon Archetype</p>

                <p className="text-stone-300 text-sm leading-relaxed mb-8 px-2 font-light">
                  "Psico-acustica pura. Crea un legame ossitocinico indissolubile con la tua audience. Diventa la voce interiore che li guida."
                </p>
              </div>

              <button className="w-4/5 py-4 border border-stone-600/50 text-stone-300 bg-white/10 transition-all text-xs tracking-[0.25em] font-bold uppercase flex items-center justify-center gap-2 rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-white/20 mb-4">
                <Unlock className="w-3 h-3" /> Materialize
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pb-8 border-t border-lux-gold/10 pt-8 opacity-50">
            <p className="text-[10px] uppercase tracking-widest text-lux-goldDark">
              Vox Lux Strategy © 2026 • <span className="cursor-pointer hover:text-lux-gold transition-colors" onClick={() => window.open('/terms', '_blank')}>Termini e Condizioni</span>
            </p>
          </div>
        </div>
      </div>


      {/* =====================================================================================
          DESKTOP VIEW (>= 1024px)
          Horizontal 3-Card Grid Center Layout (Original Style)
         ===================================================================================== */}
      <div className="hidden lg:flex w-full min-h-screen flex-col justify-center items-center relative z-10 py-10">

        {/* Header */}
        <div className="text-center mb-24 animate-[fadeIn_1s_ease-out]">
          <div className="inline-block mb-4 animate-float">
            <Crown className="w-12 h-12 text-lux-gold drop-shadow-[0_0_15px_rgba(228,197,114,0.6)]" />
          </div>
          <h1 className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-lux-gold via-lux-goldDim to-lux-goldDark drop-shadow-2xl mb-4">
            VOX LUX STRATEGY
          </h1>
          <p className="text-lg text-blue-200/60 font-serif italic tracking-wide">
            "Il portale per l'ascensione neuro-digitale."
          </p>
        </div>

        {/* 3-Card Grid - "The Trinity Layout" */}
        <div className="w-full max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-3 gap-8 items-stretch h-[550px]">

            {/* CARD 1: MATRICE I (THE GOLDEN SUN) */}
            <div
              onClick={() => onEnter('matrice-1')}
              onMouseEnter={playHoverSound}
              className="group relative rounded-lg overflow-hidden flex flex-col pt-12 pb-8 px-6 items-center text-center transition-all duration-700 ease-out hover:scale-105 cursor-pointer border border-yellow-500/20 hover:border-yellow-300 bg-black hover:shadow-[0_0_80px_rgba(250,204,21,0.4)]"
            >
              {/* GOLDEN EFFECT (Not Orange) */}
              <div className="absolute inset-0 opacity-30 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#facc15_360deg)] animate-[spin_6s_linear_infinite] blur-xl opacity-20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-black to-black"></div>
                {/* Floating Gold Dust */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-60 animate-pulse text-yellow-200"></div>
              </div>

              <div className="relative z-10 flex flex-col h-full items-center">
                <div className="w-24 h-24 rounded-full border border-yellow-500/40 flex items-center justify-center bg-black/60 mb-8 group-hover:bg-yellow-500/10 group-hover:scale-110 transition-all duration-500 shadow-[0_0_30px_rgba(250,204,21,0.1)] group-hover:shadow-[0_0_60px_rgba(250,204,21,0.6)] relative overflow-hidden">
                  {/* Mini Essence */}
                  <div className="absolute inset-0 bg-yellow-400/10 blur-md animate-pulse"></div>
                  <Sparkles className="w-10 h-10 text-yellow-500 group-hover:text-yellow-100 transition-colors relative z-10 animate-[spin_8s_linear_infinite]" />
                </div>

                <h3 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 to-yellow-600 mb-2 group-hover:from-white group-hover:to-yellow-300 transition-all drop-shadow-lg">STORYTELLING MASTERMIND</h3>
                <p className="text-[10px] uppercase tracking-[0.4em] text-yellow-600 group-hover:text-yellow-300 mb-6 transition-colors font-bold">The Sun Archetype</p>

                <p className="text-stone-400 text-sm leading-relaxed mb-6 flex-grow px-4 group-hover:text-yellow-100/90 transition-colors">
                  "L'algoritmo perduto della Risonanza Limbica. Una tecnologia narrativa che bypassa la logica e installa la tua autorità direttamente nei centri decisionali del cervello. È il potere che hai sempre saputo di avere."
                </p>

                <div className="mb-6 flex flex-col items-center">
                  <span className="text-lux-gold text-2xl font-bold">€597</span>
                  <span className="text-stone-500 text-xs line-through">€997</span>
                </div>

                <button className="w-full py-4 border border-yellow-900/30 text-yellow-600 group-hover:text-black group-hover:bg-yellow-400 transition-all text-sm tracking-[0.15em] font-bold uppercase flex items-center justify-center gap-2 rounded-sm shadow-[0_0_20px_rgba(250,204,21,0.1)] group-hover:shadow-[0_0_40px_rgba(250,204,21,0.5)]">
                  <Unlock className="w-4 h-4" /> ACQUISTA ORA
                </button>
              </div>
            </div>

            {/* CARD 2: ASCENSION BOX (THE HYPER PORTAL) */}
            <div
              onClick={() => onEnter('ascension-box')}
              onMouseEnter={playHoverSound}
              className="z-20 relative -mt-8 mb-8 rounded-xl overflow-hidden flex flex-col items-center justify-center text-center transition-all duration-700 hover:scale-110 cursor-pointer border border-indigo-500/30 hover:border-white bg-black shadow-[0_0_50px_rgba(79,70,229,0.3)] hover:shadow-[0_0_100px_rgba(99,102,241,0.8)]"
            >
              {/* HYPERSPACE EFFECT */}
              <div className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity">
                {/* Rotating Vortex */}
                <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,#6366f1_360deg)] animate-[spin_3s_linear_infinite] opacity-40"></div>
                {/* Deep Space */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950 via-black to-black"></div>
                {/* Moving Stars */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-80 animate-[ping_3s_infinite]"></div>
              </div>

              <div className="absolute top-0 right-0 p-4 z-30">
                <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-black text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-[0_0_20px_rgba(52,211,153,0.6)] animate-pulse border border-white/50">Best Value</div>
              </div>

              <div className="relative z-10 p-8 w-full flex flex-col items-center h-full justify-center">
                <div className="w-28 h-28 rounded-full border-2 border-indigo-400/30 flex items-center justify-center bg-indigo-950/50 mb-6 group-hover:border-white group-hover:rotate-180 transition-all duration-700 shadow-[0_0_40px_rgba(99,102,241,0.5)]">
                  <Box className="w-12 h-12 text-indigo-300 group-hover:text-white" />
                </div>

                <h3 className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-100 to-indigo-400 mb-2 drop-shadow-[0_0_15px_rgba(99,102,241,0.8)]">ASCENSION</h3>
                <p className="text-xs uppercase tracking-[0.5em] text-indigo-400 mb-8 font-bold">The Singularity</p>

                <div className="space-y-4 w-full text-left pl-8 mb-8 flex-grow opacity-80 group-hover:opacity-100 transition-opacity border-l border-indigo-500/30 ml-4">
                  <div className="flex items-center gap-3 text-sm text-indigo-100"><Zap className="w-4 h-4 text-indigo-400" /> Accesso Totale (60 Moduli)</div>
                  <div className="flex items-center gap-3 text-sm text-indigo-100"><Crown className="w-4 h-4 text-indigo-400" /> 12 Mastermind Esclusive</div>
                  <div className="flex items-center gap-3 text-sm text-indigo-100"><Zap className="w-4 h-4 text-indigo-400" /> Cripte Vocali Segrete</div>
                </div>

                <div className="mb-6 flex flex-col items-center">
                  <span className="text-white text-4xl font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">€997</span>
                  <span className="text-indigo-300 text-sm line-through mt-1">€1.194</span>
                  <span className="text-emerald-400 text-xs font-bold mt-2 uppercase tracking-wide animate-pulse">RISPARMIO 20%</span>
                </div>

                <button className="w-full py-5 bg-white text-black text-sm tracking-[0.2em] font-bold uppercase flex items-center justify-center gap-3 hover:bg-indigo-100 transition-all rounded-sm shadow-[0_0_30px_white] hover:shadow-[0_0_60px_white]">
                  ACCEDI ALL'ASCENSIONE <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* CARD 3: MATRICE II (THE MOON / PODCAST - HALF ORBITS) */}
            <div
              onClick={() => onEnter('matrice-2')}
              onMouseEnter={playHoverSound}
              className="group relative rounded-lg overflow-hidden flex flex-col pt-12 pb-8 px-6 items-center text-center transition-all duration-700 ease-out hover:scale-105 cursor-pointer border border-stone-700 hover:border-white bg-black hover:shadow-[0_0_80px_rgba(255,255,255,0.3)]"
            >
              {/* MOON EFFECT - Enhanced for PC to match Mobile Vitality */}
              <div className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity duration-700">
                {/* Half-Orbit 1 - Brighter */}
                <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] border-t-2 border-r-2 border-white/30 rounded-full animate-[spin_10s_linear_infinite] group-hover:border-white/50 transition-colors"></div>
                {/* Half-Orbit 2 (Reverse) - Brighter */}
                <div className="absolute top-[15%] left-[15%] w-[70%] h-[70%] border-b-2 border-l-2 border-white/20 rounded-full animate-[spin_15s_linear_infinite_reverse] group-hover:border-white/40 transition-colors"></div>

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-stone-800/40 via-black to-black"></div>
              </div>

              <div className="relative z-10 flex flex-col h-full items-center">
                {/* Mic with HEARTBEAT Pulse (Ported from Mobile) */}
                <div className="w-24 h-24 rounded-full border border-stone-600 flex items-center justify-center bg-black/50 mb-8 group-hover:border-white group-hover:bg-white/10 transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_50px_rgba(255,255,255,0.6)] relative">
                  <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/20 group-hover:animate-[ping_3s_infinite] transition-all"></div>
                  <Mic className="w-10 h-10 text-stone-500 group-hover:text-white transition-colors animate-[pulse_4s_infinite] relative z-10" />
                </div>

                <h3 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-stone-200 to-stone-600 mb-2 group-hover:from-white group-hover:to-stone-300 transition-all drop-shadow-lg">PODCAST MASTERMIND</h3>
                <p className="text-[10px] uppercase tracking-[0.4em] text-stone-500 group-hover:text-white mb-6 transition-colors font-bold">The Moon Archetype</p>

                <p className="text-stone-500 text-sm leading-relaxed mb-6 flex-grow px-4 group-hover:text-stone-300 transition-colors">
                  "Psico-acustica pura. Crea un legame ossitocinico indissolubile con la tua audience. Diventa la voce interiore che li guida, il segreto che volevano custodire."
                </p>

                <div className="mb-6 flex flex-col items-center">
                  <span className="text-stone-300 text-2xl font-bold">€597</span>
                  <span className="text-stone-600 text-xs line-through">€997</span>
                </div>

                <button className="w-full py-4 border border-stone-800 text-stone-500 group-hover:text-white group-hover:border-white/80 group-hover:bg-white/5 transition-all text-sm tracking-[0.15em] font-bold uppercase flex items-center justify-center gap-2 rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                  <Unlock className="w-4 h-4" /> ACQUISTA ORA
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>


    </div>
  );
};