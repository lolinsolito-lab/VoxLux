import React, { useState, useEffect } from 'react';
import { COURSES, Mastermind, Module } from '../services/courseData';
import { getThemeForMastermind } from '../services/themeRegistry';
import { useAudioSystem } from '../hooks/useAudioSystem';
import { ImmersiveWorldView } from './ImmersiveWorldView';
import { CinematicHubView } from './CinematicHubView';
import { PodcastCinematicHub } from './PodcastCinematicHub';
import { AscensionHubView } from './AscensionHubView';
import { ArrowLeft, Play, X, Menu, Lock, CheckCircle, ChevronRight, ChevronDown } from 'lucide-react';

interface CourseViewProps {
    courseId: string;
    onBack: () => void;
    onNavigateToCourse?: (courseId: string) => void;
}

export const CourseView: React.FC<CourseViewProps> = ({ courseId, onBack, onNavigateToCourse }) => {
    const course = COURSES[courseId] || COURSES['matrice-1'];

    // State for HUB Navigation
    const [selectedMastermindId, setSelectedMastermindId] = useState<string>(course.masterminds[0].id);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

    // State for HYBRID IMMERSIVE MODE (Only for Matrice 1 & 2)
    const [activeImmersiveWorldId, setActiveImmersiveWorldId] = useState<string | null>(null);

    const { playSound } = useAudioSystem();

    // Derived
    const selectedMastermindIndex = course.masterminds.findIndex(m => m.id === selectedMastermindId);
    const selectedMastermind = course.masterminds[selectedMastermindIndex];

    // Logic
    const handleMastermindSelect = (id: string) => {
        const index = course.masterminds.findIndex(m => m.id === id);

        // ISOLATION LOGIC: If this is Matrice 1 OR Matrice 2, launch the World!
        if ((course.id === 'matrice-1' || course.id === 'matrice-2') && index !== -1) {
            setActiveImmersiveWorldId(id);
        } else {
            // Standard behavior for other courses
            setSelectedMastermindId(id);
        }

        setSidebarOpen(false);
        playSound('click');
    };

    // Complete World Callback
    const handleWorldComplete = () => {
        // Mark all modules in this world as complete (simplified logic)
        const worldModules = course.masterminds.find(m => m.id === activeImmersiveWorldId)?.modules || [];
        const newCompleted = new Set(completedModules);
        worldModules.forEach(m => newCompleted.add(m.id));
        setCompletedModules(newCompleted);

        setActiveImmersiveWorldId(null); // Return to Hub
        playSound('victory');
    };

    // RENDER LOGIC:
    // 1. Active World -> ImmersiveWorldView
    // 2. Matrice 1 Root -> CinematicHubView
    // 3. Matrice 2 Root -> PodcastCinematicHub
    // 4. Other Courses -> Standard List View

    if (activeImmersiveWorldId && (course.id === 'matrice-1' || course.id === 'matrice-2')) {
        let targetId = activeImmersiveWorldId;
        let forcedIndex = -1;

        // PARSE COMPOSITE ID (For Matrice 2 DB Compatibility)
        if (targetId.includes('|')) {
            const parts = targetId.split('|');
            targetId = parts[0];
            forcedIndex = parseInt(parts[1]);
        }

        let worldIndex = course.masterminds.findIndex(m => m.id === targetId);

        // Fallback to forced index if normal lookup fails (Static vs DB Mismatch)
        if (worldIndex === -1 && forcedIndex !== -1) {
            worldIndex = forcedIndex;
        }

        const worldData = course.masterminds[worldIndex];

        // Safety guard
        if (!worldData) {
            console.error("World Data not found for", activeImmersiveWorldId);
            setActiveImmersiveWorldId(null);
            return null;
        }

        const theme = getThemeForMastermind(worldIndex, course.id); // Pass course.id

        return (
            <ImmersiveWorldView
                mastermind={worldData}
                theme={theme}
                onClose={() => setActiveImmersiveWorldId(null)}
                onCompleteWorld={handleWorldComplete}
                courseId={course.id}
            />
        );
    }

    if (course.id === 'matrice-1') {
        return (
            <CinematicHubView
                courseId={course.id}
                onSelectWorld={(id) => setActiveImmersiveWorldId(id)}
                onBack={onBack}
                completedModules={completedModules}
            />
        );
    }

    if (course.id === 'ascension-box') {
        return (
            <AscensionHubView
                onSelectCourse={(targetId) => {
                    if (onNavigateToCourse) {
                        onNavigateToCourse(targetId);
                    } else {
                        console.warn('Navigation not available');
                    }
                }}
                onBack={onBack}
            />
        );
    }

    if (course.id === 'ascension-box') {
        return (
            <AscensionHubView
                onSelectCourse={(targetId) => {
                    // Switch the entire course context
                    // This assumes the parent component handles course switching or we navigate
                    // Since specific navigation isn't passed, we might need a workaround or callback
                    // IF onBack is actually "go to course list", we might need a "switch course" prop.
                    // For now, let's assume this view replaces the current course view.
                    // If we need to actually change the *active* course in the parent state,
                    // we might need to use a global state or a different callback.
                    // However, standard flow is: List -> Course.
                    // To switch from Ascension to Matrice 1, we basically want to "navigate" to Matrice 1.
                    // Let's assume for now we can't easily switch the parent's `selectedCourseId` without a prop.
                    // But waiting, `onBack` goes to list. 
                    // Let's trigger a window location change or similar if we can't lift state?
                    // actually, let's check if we can pass a "onSwitchCourse" to CourseView?
                    // No, for now let's just Log it or use a simple hack if needed.
                    // WAIT: The user asked for it to be a hub. 
                    // If I'm in "Ascension Box" course, I am viewing that course.
                    // If I click Matrice 1, I want to *view* Matrice 1.
                    // This might require a change in how the App manages state if `setSelectedCourse` isn't available here.
                    // Let's look at how CourseView is used.
                    // It is used in App.tsx typically.
                    console.log("Switching to", targetId);
                    // For now, just play a sound. We might need to refactor App.tsx to support this jump.
                    // Or, we render the OTHER hub *inside* this one? 
                    // No, that's nesting.
                    alert("Navigation to " + targetId + " requested. (Functionality requires App state lift)");
                }}
                onBack={onBack}
            />
        );
    }

    if (course.id === 'matrice-2') {
        return (
            <PodcastCinematicHub
                courseId={course.id}
                onSelectWorld={(id) => setActiveImmersiveWorldId(id)}
                onBack={onBack}
                completedModules={completedModules}
            />
        );
    }

    // --- STANDARD LIST VIEW (For other courses) ---

    return (
        <div className="min-h-screen bg-black text-gray-100 flex overflow-hidden font-sans">

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 w-full z-20 bg-black/90 backdrop-blur-md border-b border-gray-800 p-4 flex items-center justify-between">
                <button onClick={onBack}>
                    <ArrowLeft className="w-6 h-6 text-gray-400" />
                </button>
                <span className="text-sm font-bold tracking-widest text-lux-gold uppercase">Vox Lux Strategy</span>
                <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {sidebarOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
                </button>
            </div>

            {/* SIDEBAR NAVIGATION */}
            <aside className={`
               fixed inset-y-0 left-0 z-30 w-80 bg-zinc-900/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out
               lg:relative lg:transform-none lg:flex lg:flex-col
               ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
           `}>
                <div className="p-8 border-b border-white/10 hidden lg:block">
                    <button onClick={onBack} className="flex items-center text-gray-500 hover:text-white transition-colors mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Torna alla Home
                    </button>
                    <h1 className="text-xl font-bold text-white uppercase tracking-wider">{course.title}</h1>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
                    {course.masterminds.map((mastermind, idx) => {
                        const isActive = mastermind.id === selectedMastermindId;
                        const isLocked = idx > 0 && !completedModules.has(course.masterminds[idx - 1].modules[0].id); // Simplified lock logic

                        return (
                            <button
                                key={mastermind.id}
                                onClick={() => !isLocked && handleMastermindSelect(mastermind.id)}
                                disabled={isLocked && false} // Disable off for testing
                                className={`w-full text-left p-4 rounded-lg transition-all border border-transparent group relative overflow-hidden
                                   ${isActive ? 'bg-lux-gold/10 border-lux-gold/30' : 'hover:bg-white/5 hover:border-white/10'}
                                   ${isLocked ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                               `}
                            >
                                <div className="flex items-start justify-between relative z-10">
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1 block">
                                            Livello {idx + 1}
                                        </span>
                                        <h3 className={`font-bold ${isActive ? 'text-lux-gold' : 'text-gray-300 group-hover:text-white'}`}>
                                            {mastermind.title.split(':')[0]}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{mastermind.subtitle}</p>
                                    </div>
                                    {isActive && <ChevronRight className="w-5 h-5 text-lux-gold" />}
                                    {isLocked && <Lock className="w-4 h-4 text-gray-600" />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 overflow-y-auto bg-gradient-to-br from-black to-zinc-900 relative p-4 lg:p-12 pt-24 lg:pt-12 scrollbar-thin">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="mb-12">
                        <span className="text-lux-gold uppercase tracking-[0.2em] text-xs font-bold mb-2 block">
                            Modulo Corrente
                        </span>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                            {selectedMastermind.title}
                        </h2>
                        <p className="text-xl text-gray-400 font-serif italic border-l-4 border-lux-gold/30 pl-6 py-2">
                            "{selectedMastermind.subtitle}"
                        </p>

                        {/* CALL TO ACTION FOR IMMERSIVE MODE */}
                        {course.id === 'matrice-1' && (
                            <button
                                onClick={() => handleMastermindSelect(selectedMastermind.id)}
                                className="mt-8 px-8 py-4 bg-lux-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-colors shadow-[0_0_30px_rgba(251,191,36,0.2)] flex items-center gap-3"
                            >
                                <Play className="w-5 h-5 fill-current" />
                                Entra nel Mondo
                            </button>
                        )}
                    </div>

                    {/* STANDARD LIST VIEW (For other courses or as preview) */}
                    <div className="space-y-4">
                        {selectedMastermind.modules.map((module, idx) => (
                            <div key={module.id} className="bg-white/5 border border-white/10 p-6 rounded-lg flex items-center gap-6 hover:bg-white/10 transition-colors group">
                                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center border border-white/10 group-hover:border-lux-gold/50 transition-colors text-gray-500 font-bold font-mono">
                                    {idx + 1}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-bold text-lg">{module.title}</h4>
                                    <p className="text-gray-400 text-sm mt-1">{module.description}</p>
                                </div>
                                <div className="text-xs uppercase tracking-widest text-gray-600 font-bold bg-black/50 px-3 py-1 rounded">
                                    {module.duration}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};