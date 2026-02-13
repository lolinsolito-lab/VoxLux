import React, { useState, useEffect } from 'react';
import { Mastermind } from '../services/courseData';
import { WorldTheme } from '../services/themeRegistry';
import { useAudioSystem } from '../hooks/useAudioSystem';
import { WorldBackground } from './WorldBackground';
import { CinematicMediaPlayer } from './CinematicMediaPlayer';
import { ArrowLeft, Crown, Fingerprint, BookOpen, X, Lock } from 'lucide-react';
import { QuizView } from './QuizView';
import { DiplomaView } from './DiplomaView';
import { world10Quiz } from '../services/courses/matrice1Quiz';
import { podcastQuiz } from '../services/courses/matrice2Quiz';
import { useAuth } from '../contexts/AuthContext';
// import { World1Origine } from './worlds/World1Origine'; // Legacy fallback import - REMOVED

// --- CONTENUTI STORYTELLING (Nuovo Path) ---
import { world1Content } from '../content/story/world1';
import { supabase } from '../services/supabase';
import { world2 } from '../content/story/world2';
import { world3 } from '../content/story/world3';
import { world4 } from '../content/story/world4';
import { world5 } from '../content/story/world5';
import { world6 } from '../content/story/world6';
import { world7 } from '../content/story/world7';
import { world8 } from '../content/story/world8';
import { world9 } from '../content/story/world9';
import { world10 } from '../content/story/world10';
import { WorldContent } from '../services/courses/types';
import { mergeWorldContent } from '../services/contentMerger';

const WORLD_CONTENT_MAP: Record<number, WorldContent> = {
    1: world1Content,
    2: world2,
    3: world3,
    4: world4,
    5: world5,
    6: world6,
    7: world7,
    8: world8,
    9: world9,
    10: world10
};

// --- NUOVO COMPONENTE VIEW ---
import { StorytellingWorldView } from './StorytellingWorldView';
import { PodcastWorldView } from './PodcastWorldView';
import { podcastWorld1Immersive } from '../content/podcast/world1_immersive';
import { podcastWorld2Immersive } from '../content/podcast/world2_immersive';
import { podcastWorld3Immersive } from '../content/podcast/world3_immersive';
import { podcastWorld4Immersive } from '../content/podcast/world4_immersive';
import { podcastWorld5Immersive } from '../content/podcast/world5_immersive';
import { podcastWorld6Immersive } from '../content/podcast/world6_immersive';
import { podcastWorld7Immersive } from '../content/podcast/world7_immersive';
import { podcastWorld8Immersive } from '../content/podcast/world8_immersive';
import { podcastWorld9Immersive } from '../content/podcast/world9_immersive';
import { podcastWorld10Immersive } from '../content/podcast/world10_immersive';

interface ImmersiveWorldViewProps {
    mastermind: Mastermind;
    theme: WorldTheme;
    onClose: () => void;
    onCompleteWorld: () => void;
    courseId?: string; // Default 'matrice-1'
}

type Stage = 'WORLD_INTRO' | 'MODULE_LOCKED' | 'RITUAL_ACTIVE' | 'MODULE_CONTENT' | 'MODULE_COMPLETE_REVEAL' | 'QUIZ_ACTIVE' | 'FINAL_RITUAL' | 'WORLD_OUTRO';

export const ImmersiveWorldView: React.FC<ImmersiveWorldViewProps> = ({
    mastermind,
    theme,
    onClose,
    onCompleteWorld,
    courseId = 'matrice-1'
}) => {
    // STATE
    const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
    const [stage, setStage] = useState<Stage>('WORLD_INTRO');
    const [quizModuleId, setQuizModuleId] = useState<string | null>(null);

    // AUTH & SYSTEM
    const { user } = useAuth();
    const { playSound } = useAudioSystem();

    // --- ROUTING LOGIC (THE CRITICAL PART) ---
    const isStorytelling = courseId === 'matrice-1';
    const isPodcast = courseId === 'matrice-2';

    // Dynamic World Content Loading
    // Supports both 'mondo_1' and 'world-1' (in case of content override)
    const worldMatch = theme.id.match(/(?:mondo_|world[-_]|pod_)(\d+)/i);
    const worldNum = worldMatch ? parseInt(worldMatch[1]) : 0;

    // CONTENT RESOLVER
    let activeContent = null;
    if (isStorytelling) {
        activeContent = WORLD_CONTENT_MAP[worldNum];
    } else if (isPodcast) {
        const podMap: Record<number, any> = {
            1: podcastWorld1Immersive,
            2: podcastWorld2Immersive,
            3: podcastWorld3Immersive,
            4: podcastWorld4Immersive,
            5: podcastWorld5Immersive,
            6: podcastWorld6Immersive,
            7: podcastWorld7Immersive,
            8: podcastWorld8Immersive,
            9: podcastWorld9Immersive,
            10: podcastWorld10Immersive
        };
        activeContent = podMap[worldNum];
    }

    // --- MERGE DB OVERRIDES ---
    // Find the matching module from DB based on worldNum (1-based index)
    // DB modules likely have order_index 0-9.
    // So worldNum 1 matches order_index 0.
    const dbModule = mastermind.modules ? mastermind.modules.find(m => m.order_index === worldNum - 1) : null;

    // FETCH QUIZ AVAILABILITY (Must be top level)
    useEffect(() => {
        const checkQuiz = async () => {
            // We use the slug from local DB module (e.g. 'm1-10') or construct it
            // worldNum is 1-based.
            // Storytelling slugs: 'm1-' + worldNum
            // Podcast slugs: 'm2-' + worldNum

            const targetSlug = isStorytelling
                ? `m1-${worldNum}`
                : isPodcast
                    ? `m2-${worldNum}`
                    : null;

            if (targetSlug) {
                // Query Quiz by joining Module on Slug
                const { data } = await supabase
                    .from('quizzes')
                    .select('id, module:modules!inner(slug)')
                    .eq('modules.slug', targetSlug)
                    .single();

                if (data) {
                    // console.log('[ImmersiveWorldView] Found Quiz:', data.id);
                    setQuizModuleId(data.id); // This is the QUIZ ID, not Module ID
                } else {
                    setQuizModuleId(null);
                }
            } else {
                setQuizModuleId(null);
            }
        };
        checkQuiz();
    }, [worldNum, isStorytelling, isPodcast]);

    // Content merging (imported at top of file)

    if (dbModule) {
        // console.log(`[ImmersiveWorldView] Merging DB content for World ${worldNum}`, dbModule);
        activeContent = mergeWorldContent(activeContent, dbModule);
    }

    // console.log('[ImmersiveWorldView] Debug:', { themeId: theme.id, worldNum, activeContent: !!activeContent });

    // --- STAGE OVERRIDES (Quiz & Diploma) ---

    // RENDER QUIZ
    if (stage === 'QUIZ_ACTIVE' && quizModuleId) {
        return (
            <div className="absolute inset-0 z-50 bg-black">
                <QuizView
                    quizId={quizModuleId} // Updated prop name
                    onComplete={(passed) => passed ? setStage('FINAL_RITUAL') : onClose()}
                    onClose={onClose}
                />
            </div>
        );
    }

    // RENDER DIPLOMA
    if (stage === 'FINAL_RITUAL') {
        return <DiplomaView userName={user?.name || "Ospite"} onClose={onCompleteWorld} courseId={courseId} />;
    }

    // --- IMMERSIVE VIEWS ---
    if (isStorytelling && activeContent) {
        return (
            <StorytellingWorldView
                worldId={worldNum}
                content={activeContent}
                onClose={onClose}
                onComplete={() => {
                    // LINK TO END GAME QUIZ (If available for this module)
                    if (quizModuleId) {
                        setStage('QUIZ_ACTIVE');
                    } else {
                        onCompleteWorld();
                    }
                }}
            />
        );
    }

    if (isPodcast && activeContent) {
        return (
            <PodcastWorldView
                worldId={worldNum}
                content={activeContent}
                onClose={onClose}
                onComplete={() => {
                    // LINK TO END GAME QUIZ (If available for this module)
                    if (quizModuleId) {
                        setStage('QUIZ_ACTIVE');
                    } else {
                        onCompleteWorld();
                    }
                }}
            />
        );
    }



    /* ========================================= */
    /*          LEGACY & PODCAST VIEW            */
    /*     (Mantengo il codice vecchio per       */
    /*      Podcast e altri mondi non migrati)   */
    /* ========================================= */

    const currentModule = mastermind.modules[currentModuleIdx];
    const isMasteryWorld = theme.id === 'mondo_10' || theme.id === 'pod_10';

    // On Mount Effect for Legacy
    useEffect(() => {
        if (!isStorytelling || theme.id !== 'mondo_1') {
            playSound('ambient_transition');
        }
    }, [playSound, isStorytelling, theme.id]);

    const advanceStage = () => {
        playSound('click');
        switch (stage) {
            case 'WORLD_INTRO': setStage('MODULE_LOCKED'); break;
            case 'MODULE_LOCKED': setStage('RITUAL_ACTIVE'); break;
            case 'RITUAL_ACTIVE': playSound('unlock'); setStage('MODULE_CONTENT'); break;
            case 'MODULE_CONTENT': playSound('victory'); setStage('MODULE_COMPLETE_REVEAL'); break;
            case 'MODULE_COMPLETE_REVEAL':
                if (currentModuleIdx < mastermind.modules.length - 1) {
                    setCurrentModuleIdx(prev => prev + 1);
                    setStage('MODULE_LOCKED');
                } else {
                    if (isMasteryWorld) setStage('QUIZ_ACTIVE');
                    else setStage('WORLD_OUTRO');
                }
                break;
            case 'WORLD_OUTRO': onCompleteWorld(); break;
        }
    };


    // LEGACY RENDER (Podcast etc)
    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-black text-white font-sans overflow-hidden">
            <WorldBackground theme={theme} active={true} />

            {/* HEADER */}
            <div className="absolute top-0 left-0 w-full p-8 flex justify-between z-50 pointer-events-none">
                <button onClick={onClose} className="pointer-events-auto flex items-center gap-2 text-white/50 hover:text-white">
                    <ArrowLeft size={20} /> <span className="text-xs uppercase">Esci</span>
                </button>
            </div>

            {/* STAGES */}
            <div className="flex-1 flex items-center justify-center p-8 relative z-10 pointer-events-auto">
                {stage === 'WORLD_INTRO' && (
                    <div className="text-center cursor-pointer" onClick={advanceStage}>
                        <h1 className="text-6xl font-display font-bold mb-4">{theme.name}</h1>
                        <p className="text-xl text-gray-300 italic">"{theme.narrative?.intro}"</p>
                        <p className="mt-8 text-xs uppercase tracking-widest text-lux-gold animate-pulse">Clicca per Entrare</p>
                    </div>
                )}

                {stage === 'MODULE_LOCKED' && (
                    <div className="text-center cursor-pointer" onClick={advanceStage}>
                        <Lock size={48} className="mx-auto mb-4 text-white/50" />
                        <h2 className="text-2xl">Modulo {currentModuleIdx + 1}</h2>
                        <p className="text-gray-400">Clicca per sbloccare</p>
                    </div>
                )}

                {stage === 'RITUAL_ACTIVE' && (
                    <div className="text-center cursor-pointer" onClick={advanceStage}>
                        <Fingerprint size={64} className="mx-auto mb-4 text-lux-gold animate-pulse" />
                        <h2 className="text-2xl">Rituale in Corso</h2>
                        <p>Clicca per completare</p>
                    </div>
                )}

                {stage === 'MODULE_CONTENT' && (
                    <CinematicMediaPlayer
                        module={currentModule || { id: 'legacy-fallback', title: "Modulo", type: "audio", description: "Desc", duration: "10:00", output: "None" }}
                        theme={theme}
                        onComplete={advanceStage}
                        onClose={onClose}
                    />
                )}

                {stage === 'MODULE_COMPLETE_REVEAL' && (
                    <div className="text-center cursor-pointer" onClick={advanceStage}>
                        <Crown className="mx-auto mb-4 text-lux-gold" size={48} />
                        <h2 className="text-2xl">Modulo Completato</h2>
                        <button className="mt-4 bg-white text-black px-6 py-2 rounded">Continua</button>
                    </div>
                )}

                {stage === 'WORLD_OUTRO' && (
                    <div className="text-center cursor-pointer" onClick={advanceStage}>
                        <h1 className="text-4xl">Mondo Completato</h1>
                        <p>Clicca per uscire</p>
                    </div>
                )}

                {/* VISIBLE DEBUG OVERLAY */}
                <div className="absolute bottom-4 left-4 bg-black/80 p-4 rounded border border-red-500 z-[100] text-xs font-mono text-red-500 pointer-events-none">
                    <p>DEBUG CHECK:</p>
                    <p>CourseID: {courseId}</p>
                    <p>ThemeID: {theme.id}</p>
                    <p>WorldNum: {worldNum}</p>
                    <p>IsStorytelling: {isStorytelling ? 'YES' : 'NO'}</p>
                    <p>ActiveContent: {activeContent ? 'FOUND' : 'MISSING'}</p>
                </div>
            </div>
        </div>
    );
};
