import React from 'react';
import { View, NavItem } from '../types';
import { Mic, Video, Image, Box, FileAudio, Keyboard, Aperture, Activity, LogOut, Hexagon } from 'lucide-react';

interface NavigationProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onLogout: () => void;
}

const navItems: NavItem[] = [
  { id: View.LIVE_AUDIO, label: 'Vox Live', icon: <Mic className="w-4 h-4" />, description: 'Conversational Voice' },
  { id: View.VEO_VIDEO, label: 'Veo Cinema', icon: <Video className="w-4 h-4" />, description: 'Video Generation' },
  { id: View.IMAGE_GEN, label: 'Lux Imagery', icon: <Image className="w-4 h-4" />, description: 'Pro Image Gen' },
  { id: View.IMAGE_EDITOR, label: 'Nano Edit', icon: <Aperture className="w-4 h-4" />, description: 'Fast Image Editing' },
  { id: View.VIDEO_ANALYZE, label: 'Vision Core', icon: <Activity className="w-4 h-4" />, description: 'Video Understanding' },
  { id: View.TTS, label: 'Orator', icon: <FileAudio className="w-4 h-4" />, description: 'Text to Speech' },
  { id: View.TRANSCRIBE, label: 'Scribe', icon: <Keyboard className="w-4 h-4" />, description: 'Audio Transcription' },
  { id: View.GENERAL_TASK, label: 'Omni Task', icon: <Box className="w-4 h-4" />, description: 'General Intelligence' },
];

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate, onLogout }) => {
  return (
    <nav className="w-full md:w-72 bg-lux-navy border-b md:border-b-0 md:border-r border-lux-gold/20 flex flex-row md:flex-col flex-shrink-0 md:h-screen relative z-30 shadow-[5px_0_30px_rgba(0,0,0,0.5)] overflow-x-auto md:overflow-y-auto overflow-y-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lux-goldDark via-lux-gold to-lux-goldDark opacity-50 hidden md:block"></div>

      <div className="p-4 md:p-8 border-r md:border-r-0 md:border-b border-lux-gold/10 relative flex-shrink-0 flex items-center md:block">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-lux-gold/30 hidden md:block"></div>
        <div className="flex items-center gap-3">
            <Hexagon className="w-6 h-6 fill-lux-gold/10 text-lux-gold" /> 
            <div>
                <h1 className="text-lg md:text-2xl font-display font-bold text-lux-gold drop-shadow-[0_0_10px_rgba(228,197,114,0.3)] whitespace-nowrap">
                VOX LUX
                </h1>
                <p className="text-[8px] md:text-[10px] text-lux-cyan/60 uppercase tracking-[0.25em] pl-1 hidden md:block">Ascension Portal</p>
            </div>
        </div>
      </div>
      
      <div className="flex-1 py-2 md:py-8 px-2 md:px-4 flex flex-row md:flex-col gap-1 md:space-y-1 overflow-x-auto md:overflow-visible items-center md:items-stretch">
        <div className="hidden md:block px-4 mb-6">
           <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-lux-gold rounded-full"></div>
            <p className="text-[10px] uppercase tracking-widest text-lux-goldDark font-bold">Strumenti Generativi</p>
            <div className="flex-1 h-[1px] bg-lux-goldDark/20"></div>
           </div>
        </div>

        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`min-w-[60px] md:w-full text-left px-3 md:px-4 py-2 md:py-3 transition-all duration-300 flex flex-col md:flex-row items-center md:gap-4 group relative border border-transparent rounded md:rounded-none ${
              currentView === item.id
                ? 'bg-lux-royal/40 border-lux-cyan/30 shadow-[0_0_15px_rgba(79,212,208,0.1)]'
                : 'hover:bg-white/5 hover:border-lux-gold/10'
            }`}
          >
            {/* Active Indicator Line (Desktop) */}
            {currentView === item.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-lux-cyan shadow-[0_0_10px_#4FD4D0] hidden md:block"></div>
            )}

            <span className={`${currentView === item.id ? 'text-lux-cyan' : 'text-gray-500 group-hover:text-lux-gold'} transition-colors`}>
              {item.icon}
            </span>
            <div className="hidden md:block">
              <div className={`font-medium text-sm tracking-wide ${currentView === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                  {item.label}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="p-4 md:p-6 border-l md:border-l-0 md:border-t border-lux-gold/10 flex md:flex-col bg-black/20 flex-shrink-0 items-center justify-center">
        <button onClick={onLogout} className="flex items-center justify-center gap-2 text-gray-500 hover:text-red-400 text-xs uppercase tracking-wider p-2 border border-transparent hover:border-red-900/30 transition-all rounded md:w-full">
           <LogOut className="w-4 h-4 md:w-3 md:h-3" /> <span className="hidden md:inline">Disconnect</span>
        </button>
        <div className="hidden md:block text-center mt-2">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-600 hover:text-lux-gold underline decoration-lux-gold/30">
            Pricing & Billing Info
            </a>
        </div>
      </div>
    </nav>
  );
};