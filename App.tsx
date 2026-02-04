import React, { useState } from 'react';
import { View } from './types';
import { Navigation } from './components/Navigation';
import { LiveAudio } from './components/LiveAudio';
import { VeoVideoGen } from './components/VeoVideoGen';
import { ImageGen } from './components/ImageGen';
import { ImageEditor } from './components/ImageEditor';
import { VideoAnalyze } from './components/VideoAnalyze';
import { TextToSpeech } from './components/TextToSpeech';
import { AudioTranscribe } from './components/AudioTranscribe';
import { GeneralTask } from './components/GeneralTask';
import { Splash } from './components/Splash';
import { Hero } from './components/Hero';
import { CourseView } from './components/CourseView';
import { AscensionView } from './components/AscensionView';


// 🌌 VOX LUX STRATEGY - CONSOLE SIGNATURE
console.log(
  "%c VOX LUX %c STRATEGY ",
  "background: linear-gradient(135deg, #E4C572 0%, #C8AA6E 100%); color: #00040A; padding: 8px 12px; font-size: 18px; font-weight: bold; border-radius: 4px 0 0 4px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);",
  "background: #00040A; color: #E4C572; padding: 8px 12px; font-size: 18px; font-weight: bold; border-radius: 0 4px 4px 0; border: 2px solid #E4C572; border-left: none;"
);
console.log(
  "%c🎙️ Storytelling Mastermind • Neuro-Narrativa • AI Voice Tools",
  "color: #4FD4D0; font-size: 12px; font-style: italic; margin-top: 4px;"
);
console.log(
  "%cDeveloped with ⚡ by Insolito Lab • 2026",
  "color: #8B7355; font-size: 10px; margin-top: 2px;"
);

const App: React.FC = () => {
  // Start with SPLASH view
  const [currentView, setCurrentView] = useState<View>(View.SPLASH);

  // Track previous view for the portal functionality
  const [portalView, setPortalView] = useState<View>(View.LIVE_AUDIO);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('matrice-1');

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    // If it's a tool view, save it as the active portal view
    if (view !== View.SPLASH && view !== View.HERO && view !== View.HOME && view !== View.COURSE) {
      setPortalView(view);
    }
  };

  const handleSplashComplete = () => {
    setCurrentView(View.HERO);
  };

  const handleEnterCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView(View.COURSE);
  };

  const handleBackToHero = () => {
    setCurrentView(View.HERO);
  };

  const handleLogout = () => {
    setCurrentView(View.HERO);
  };

  // Render content logic
  const renderContent = () => {
    switch (currentView) {
      case View.SPLASH: return <Splash onComplete={handleSplashComplete} />;
      case View.HERO: return <Hero onEnter={handleEnterCourse} />;
      case View.COURSE:

        return <CourseView courseId={selectedCourseId} onBack={handleBackToHero} onNavigateToCourse={handleEnterCourse} />;

      // Portal Views (Tools)
      default:
        return (
          <div className="flex flex-col md:flex-row h-screen bg-lux-black text-gray-200 font-sans overflow-hidden relative">
            {/* Global Background Overlay for Portal Mode */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-lux-royal/10 via-transparent to-transparent"></div>

            <Navigation currentView={currentView} onNavigate={handleNavigate} onLogout={handleLogout} />

            <main className="flex-1 relative overflow-hidden z-10 bg-lux-black/80 backdrop-blur-sm h-full w-full">
              {currentView === View.LIVE_AUDIO && <LiveAudio />}
              {currentView === View.VEO_VIDEO && <VeoVideoGen />}
              {currentView === View.IMAGE_GEN && <ImageGen />}
              {currentView === View.IMAGE_EDITOR && <ImageEditor />}
              {currentView === View.VIDEO_ANALYZE && <VideoAnalyze />}
              {currentView === View.TTS && <TextToSpeech />}
              {currentView === View.TRANSCRIBE && <AudioTranscribe />}
              {currentView === View.GENERAL_TASK && <GeneralTask />}
            </main>
          </div>
        );
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes loading { from { width: 0; } to { width: 100%; } }
        @keyframes zoomIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
      {renderContent()}
    </>
  );
};

export default App;