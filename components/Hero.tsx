import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, ChevronDown, LogIn } from 'lucide-react';
import { useAudioSystem } from '../hooks/useAudioSystem';
import { useAuth } from '../contexts/AuthContext';
import { Footer } from './Footer';
import { RegisterModal } from './RegisterModal';
import { PricingCard } from './PricingCard';
import { AscensionCard } from './AscensionCard';
import { HeroFAQ } from './HeroFAQ';
import { VoiceTestimonials } from './VoiceTestimonials';
import { ExtrasPreview } from './ExtrasPreview';
import { StorytellingNarrative } from './StorytellingNarrative';
import { FounderSection } from './FounderSection';

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

  const storyDescription = "Impara a raccontare il tuo valore in modo che le persone smettano di scrollare e inizino ad ascoltare. 10 Moduli pratici per trasformare le tue idee in storie che convincono, vendono e restano in testa.";
  const podcastDescription = "Crea un podcast con qualità broadcast professionale. Non basta avere qualcosa da dire — devi suonare come qualcuno che vale la pena ascoltare. 10 Moduli per voce, audio e strategia.";

  return (
    <div className="min-h-screen w-full bg-lux-black text-gray-200 relative">

      {/* =====================================================================================
          NAVIGATION BAR (Fixed Top)
         ===================================================================================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm">
        {/* Logo / Brand (Mobile Only - Desktop has big title centered) */}
        <div className="flex items-center gap-2 lg:hidden">
          <Crown className="w-6 h-6 text-lux-gold" />
          <span className="text-lux-gold font-display font-bold tracking-widest text-sm">VOX AUREA</span>
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
                <LogIn className="w-4 h-4" /> <span>Accedi</span>
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
              VOX AUREA
            </h1>
            <p className="text-xs uppercase tracking-[0.5em] text-stone-500 -mt-8 mb-6">STRATEGY</p>
            <p className="text-lg md:text-2xl text-blue-200/70 font-serif italic tracking-wide mb-8">
              "La comunicazione d'élite per chi merita di essere ascoltato."
            </p>
            <div className="max-w-2xl mx-auto mb-12 space-y-4">
              <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                Storytelling strategico e Podcasting professionale per <span className="text-lux-cyan font-bold">costruire autorevolezza reale</span>.
              </p>
            </div>
            <button
              onClick={scrollToContent}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-lux-goldDim to-lux-gold text-lux-black text-sm tracking-[0.15em] font-bold uppercase hover:brightness-110 transition-all shadow-[0_0_30px_rgba(228,197,114,0.4)] rounded-sm"
            >
              Scopri i Percorsi
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </button>
          </div>
        </div>

        {/* Storytelling Narrative Sections */}
        <StorytellingNarrative />

        {/* Courses Section - Vertical Stack */}
        <div id="mobile-content" className="w-full px-6 py-24 space-y-20">

          <PricingCard
            id="matrice-1"
            type="sun"
            title={<>STORYTELLING<br />MASTERMIND</>}
            subtitle="The Sun Archetype · Il Potere delle Storie"
            description="Trasforma le tue idee in storie che convincono e vendono."
            features={[
              "🧬 10 Moduli di Storytelling Strategico",
              "🧠 Tecniche di Persuasione Narrativa",
              "📜 Framework 'Hero's Journey' Applicato",
              "🦁 Analisi del Tuo Stile Comunicativo",
              "──────────",
              "🎁 +3 Bonus Inclusi:",
              "   📄 Swipe Files Pro Edition",
              "   🔥 Framework Viralità Garantita",
              "   📚 Template Storytelling Esclusivi",
              "──────────",
              "🏆 Certificato Digitale Verificato + QR"
            ]}
            price="€597"
            priceFull="€997"
            onEnter={onEnter}
          />

          <AscensionCard onEnter={onEnter} />

          <PricingCard
            id="matrice-2"
            type="moon"
            title={<>PODCAST<br />MASTERMIND</>}
            subtitle="The Moon Archetype · La Voce Professionale"
            description="Crea un podcast professionale che ti posiziona come esperto."
            features={[
              "🌑 10 Moduli di Podcasting Professionale",
              "🎧 Qualità Audio Broadcast",
              "🌊 Ritmo, Pause e Voce Magnetica",
              "🎙️ Setup Professionale Completo",
              "──────────",
              "🎁 +3 Bonus Inclusi:",
              "   🎙️ Masterclass: AI Voice Cloning",
              "   📝 10 Script AI Podcast",
              "   🎧 Audio Branding Toolkit",
              "──────────",
              "🏆 Certificato Digitale Verificato + QR"
            ]}
            price="€597"
            priceFull="€997"
            onEnter={onEnter}
          />

          <VoiceTestimonials />
          <FounderSection />
          <ExtrasPreview />
          <HeroFAQ />
          <Footer />
        </div>
      </div>


      {/* =====================================================================================
          DESKTOP VIEW (>= 1024px)
         ===================================================================================== */}
      <div className="hidden lg:flex w-full min-h-screen flex-col justify-start items-center relative z-10 pt-44 pb-4 origin-top">

        {/* Header */}
        <div className="text-center mb-20 animate-[fadeIn_1s_ease-out]">
          <div className="inline-block mb-6 animate-float">
            <Crown className="w-14 h-14 text-lux-gold drop-shadow-[0_0_15px_rgba(228,197,114,0.6)]" />
          </div>
          <h1 className="text-7xl xl:text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-lux-gold via-lux-goldDim to-lux-goldDark drop-shadow-2xl mb-4">
            VOX AUREA
          </h1>
          <p className="text-sm uppercase tracking-[0.5em] text-stone-500 -mt-2 mb-6">STRATEGY</p>
          <p className="text-xl xl:text-2xl text-blue-200/60 font-serif italic tracking-wide">
            "La comunicazione d'élite per chi merita di essere ascoltato."
          </p>
          <p className="text-base text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed">
            Storytelling strategico e Podcasting professionale per <span className="text-lux-cyan font-semibold">costruire autorevolezza reale</span>.
          </p>
        </div>

        {/* Storytelling Narrative Sections */}
        <div className="w-full max-w-7xl mx-auto">
          <StorytellingNarrative />
        </div>

        {/* 3-Card Grid */}
        <div className="w-full max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-3 gap-8 items-stretch">

            <PricingCard
              id="matrice-1"
              type="sun"
              title="STORYTELLING MASTERMIND"
              subtitle="The Sun Archetype · Il Potere delle Storie"
              description="Trasforma le tue idee in storie che convincono e vendono."
              features={[
                "🧬 10 Moduli di Storytelling Strategico",
                "🧠 Tecniche di Persuasione Narrativa",
                "📜 Framework 'Hero's Journey' Applicato",
                "🦁 Analisi del Tuo Stile Comunicativo",
                "──────────",
                "🎁 +3 Bonus Inclusi:",
                "   📄 Swipe Files Pro Edition",
                "   🔥 Framework Viralità Garantita",
                "   📚 Template Storytelling Esclusivi",
                "──────────",
                "🏆 Certificato Digitale Verificato + QR"
              ]}
              price="€597"
              priceFull="€997"
              savings="RISPARMIO 40%"
              onEnter={onEnter}
              onHover={playHoverSound}
              isDesktop
            />

            <AscensionCard onEnter={onEnter} onHover={playHoverSound} isDesktop />

            <PricingCard
              id="matrice-2"
              type="moon"
              title="PODCAST MASTERMIND"
              subtitle="The Moon Archetype · La Voce Professionale"
              description="Crea un podcast professionale che ti posiziona come esperto."
              features={[
                "🌑 10 Moduli di Podcasting Professionale",
                "🎧 Qualità Audio Broadcast",
                "🌊 Ritmo, Pause e Voce Magnetica",
                "🎙️ Setup Professionale Completo",
                "──────────",
                "🎁 +3 Bonus Inclusi:",
                "   🎙️ Masterclass: AI Voice Cloning",
                "   📝 10 Script AI Podcast",
                "   🎧 Audio Branding Toolkit",
                "──────────",
                "🏆 Certificato Digitale Verificato + QR"
              ]}
              price="€597"
              priceFull="€997"
              savings="RISPARMIO 40%"
              onEnter={onEnter}
              onHover={playHoverSound}
              isDesktop
            />

          </div>
        </div>

        {/* Desktop Footer (Verified Placement) */}
        <div className="w-full py-2 mt-4 relative z-50 border-t border-white/5 bg-black/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-stone-400 text-xs tracking-[0.2em] mb-2">GARANZIA DI QUALITÀ VOX AUREA • PAGAMENTI SICURI STRIPE • ACCESSO IMMEDIATO</p>
            <VoiceTestimonials />
            <FounderSection />
            <ExtrasPreview />
            <HeroFAQ />
            <Footer />
          </div>
        </div>

      </div>

    </div>
  );
};