import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, ChevronDown, LogIn } from 'lucide-react';
import { useAudioSystem } from '../hooks/useAudioSystem';
import { useAuth } from '../contexts/AuthContext';
import { Footer } from './Footer';
import { RegisterModal } from './RegisterModal';
import { PricingCard } from './PricingCard';
import { AscensionCard } from './AscensionCard';

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

  const scrollToContent = () => {
    const content = document.getElementById('mobile-content');
    if (content) {
      content.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const storyDescription = "Il Protocollo Definitivo di Neuro-Narrativa. 10 Mondi e 30 Moduli per installare la tua autorità nei centri decisionali del cervello. Bypassa la logica e diventa la guida che il mercato sta disperatamente cercando.";
  const podcastDescription = "Ingegneria Acustica e Design di Esperienze Immersive. Non un semplice podcast, ma un'arma di influenza. 10 Mondi per creare legami ossitocinici indissolubili.";

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
          REGISTER MODAL
         ===================================================================================== */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onAction={scrollToContent}
      />

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

        {/* Courses Section - Vertical Stack */}
        <div id="mobile-content" className="w-full px-6 py-24 space-y-20">

          <PricingCard
            id="matrice-1"
            type="sun"
            title={<>STORYTELLING<br />MASTERMIND</>}
            subtitle="The Sun Archetype"
            description={storyDescription}
            price="€597"
            priceFull="€997"
            onEnter={onEnter}
          />

          <AscensionCard onEnter={onEnter} />

          <PricingCard
            id="matrice-2"
            type="moon"
            title={<>PODCAST<br />MASTERMIND</>}
            subtitle="The Moon Archetype"
            description={podcastDescription}
            price="€597"
            priceFull="€997"
            onEnter={onEnter}
          />

          <Footer />
        </div>
      </div>


      {/* =====================================================================================
          DESKTOP VIEW (>= 1024px)
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

        {/* 3-Card Grid */}
        <div className="w-full max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-3 gap-8 items-stretch h-[550px]">

            <PricingCard
              id="matrice-1"
              type="sun"
              title="STORYTELLING MASTERMIND"
              subtitle="The Sun Archetype"
              description={storyDescription}
              price="€597"
              priceFull="€997"
              onEnter={onEnter}
              onHover={playHoverSound}
              isDesktop
            />

            <AscensionCard onEnter={onEnter} onHover={playHoverSound} isDesktop />

            <PricingCard
              id="matrice-2"
              type="moon"
              title="PODCAST MASTERMIND"
              subtitle="The Moon Archetype"
              description={podcastDescription}
              price="€597"
              priceFull="€997"
              onEnter={onEnter}
              onHover={playHoverSound}
              isDesktop
            />

          </div>
        </div>

        {/* Desktop Footer (Optional placement, user asked for it) */}
        <div className="mt-16 w-full">
          <Footer />
        </div>

      </div>

    </div>
  );
};