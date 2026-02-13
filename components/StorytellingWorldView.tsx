import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera, Stars, Sparkles, Line, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useAudioSystem } from '../hooks/useAudioSystem';
import { WorldContent } from '../services/courses/types';
import { ChevronRight, ArrowLeft, Sun, Moon, Sparkles as SparklesIcon, Download, FileText, Image as ImageIcon, Play } from 'lucide-react';

// FIX: Split imports for 3D (Three.js) and Web (DOM)
import { useSpring as useSpring3d, animated as a3d } from '@react-spring/three';
import { useSpring as useSpringWeb, animated as aWeb } from '@react-spring/web';

// --- 3D ASSETS ---

const CelestialSun = ({ active }: { active: boolean }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.002;
            const s = active ? 1 + Math.sin(state.clock.elapsedTime) * 0.05 : 0.8;
            meshRef.current.scale.setScalar(s);
        }
    });

    return (
        <group visible={active || true}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                {/* LARGE & CENTERED (Background) */}
                <mesh ref={meshRef} position={active ? [0, 1.5, -5] : [-5, 0, -10]}>
                    <sphereGeometry args={[4.5, 64, 64]} />
                    <meshStandardMaterial
                        map={null}
                        color={active ? "#fbbf24" : "#444"}
                        emissive={active ? "#fbbf24" : "#000"}
                        emissiveIntensity={active ? 1.5 : 0}
                        roughness={0.4}
                    />
                    {active && <pointLight distance={40} intensity={2} color="#fbbf24" />}
                </mesh>
            </Float>
        </group>
    );
};

const CelestialMoon = ({ active }: { active: boolean }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y -= 0.001;
            const s = active ? 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02 : 0.6;
            meshRef.current.scale.setScalar(s);
        }
    });

    return (
        <group>
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.5}>
                {/* LARGE & CENTERED (Background) */}
                <mesh ref={meshRef} position={active ? [0, 1.5, -5] : [5, 0, -10]}>
                    <sphereGeometry args={[4.0, 64, 64]} />
                    <meshStandardMaterial
                        color={active ? "#e2e8f0" : "#333"}
                        roughness={0.8}
                        metalness={0.1}
                    />
                    {active && <pointLight distance={30} intensity={1} color="#a5f3fc" />}
                </mesh>
            </Float>
        </group>
    );
};

const GoldenThreadTree = ({ active }: { active: boolean }) => {
    const groupRef = useRef<THREE.Group>(null);
    const { viewport } = useThree();
    const count = 50;

    const tubes = React.useMemo(() => {
        return new Array(count).fill(0).map((_, i) => {
            const angleOffset = (i / count) * Math.PI * 2;
            const points = [];
            for (let j = 0; j <= 50; j++) {
                const t = j / 50;
                const height = (t * 20) - 8;
                // WIDER RADIUS FOR FRAMING EFFECT
                const radiusBase = 10.0;
                const radius = radiusBase * (1 - t * 0.2) + Math.sin(t * Math.PI * 4) * 0.5;
                const twist = t * Math.PI * 3;
                const angle = angleOffset + twist;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                points.push(new THREE.Vector3(x, height, z));
            }
            return new THREE.CatmullRomCurve3(points);
        });
    }, []);

    useFrame((state) => {
        if (!active || !groupRef.current) return;
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    });

    if (!active) return null;

    // SCALED UP TO FRAME THE SCREEN
    const scaleFactor = Math.min(1.5, Math.max(0.8, viewport.width / 10));

    return (
        <group ref={groupRef} rotation={[0.1, 0, 0]} position={[0, -5, -5]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
            {tubes.map((curve, i) => (
                <mesh key={i}>
                    <tubeGeometry args={[curve, 64, 0.02, 8, false]} />
                    <meshPhysicalMaterial
                        color={i % 2 === 0 ? "#FFD700" : "#FFE082"}
                        emissive={i % 2 === 0 ? "#FFC107" : "#FFEB3B"}
                        emissiveIntensity={0.3}
                        metalness={1}
                        roughness={0.15}
                        clearcoat={1}
                    />
                </mesh>
            ))}
            <pointLight position={[0, -6, 0]} intensity={scaleFactor * 3} color="#FFD700" distance={20} />
        </group>
    );
};

// --- HYPERSPACE WORMHOLE ---
const Wormhole = ({ active }: { active: boolean }) => {
    const groupRef = useRef<THREE.Group>(null);
    const count = 1000;

    // Create random positions for stars
    const [positions, speeds] = React.useMemo(() => {
        const pos = new Float32Array(count * 3);
        const spd = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 100; // x
            pos[i * 3 + 1] = (Math.random() - 0.5) * 100; // y
            pos[i * 3 + 2] = (Math.random() - 0.5) * 200; // z (deep depth)
            spd[i] = Math.random() * 2 + 5; // speed
        }
        return [pos, spd];
    }, []);

    useFrame((state) => {
        if (!groupRef.current) return;
        const positionsAttribute = (groupRef.current.children[0] as THREE.InstancedMesh).instanceMatrix;

        // Animate stars towards camera to create "Warp Speed"
        // This is a simplified visual trick: we rotate the group or move particles
        // For performance, let's just rotate the tunnel furiously or use a simple Points material trick
    });

    // SIMPLIFIED WARP EFFECT USING SPARKLES & CAMERA MOVEMENT
    // We will handle the movement in the main Canvas loop or simple CSS/Camera tricks
    return null; // Placeholder as we will implement the logic inside the main render loop for simplicity or use a Drei helper
};

// BigBangIntro for Separated Logic
import { BigBangIntro } from './BigBangIntro';

// 🎵 CONFIGURAZIONE AUDIO PERSONALIZZATO
// Incolla qui il link del tuo audio generato con Suno AI (mp3/wav)
// Esempio: "https://cdn1.suno.ai/..."
// Se lasciata vuota "", userà il suono "Interstellar" procedurale integrato.
const CUSTOM_WARP_AUDIO = "";

interface StorytellingWorldViewProps {
    worldId: number;
    content: WorldContent;
    onClose: () => void;
    onComplete: () => void;
}

export const StorytellingWorldView: React.FC<StorytellingWorldViewProps> = ({ worldId, content, onClose, onComplete }) => {
    const [stage, setStage] = useState<'INTRO' | 'SUN' | 'MOON' | 'THREAD'>('INTRO');
    const { playSound } = useAudioSystem();
    const dual = content.dualModules;

    // Helper to get current content object generically for Media/Downloads
    let activeContent: any = null;
    if (stage === 'SUN') activeContent = dual.sunContent;
    else if (stage === 'MOON') activeContent = dual.moonContent;
    else if (stage === 'THREAD') activeContent = dual.goldenThread;
    else if (typeof stage === 'string' && stage.startsWith('EXTRA_')) {
        const idx = parseInt(stage.split('_')[1]);
        if (content.extraModules && content.extraModules[idx]) {
            activeContent = content.extraModules[idx];
        }
    }

    // AUDIO & TRANSITIONS
    useEffect(() => {
        // REMOVED OLD INTRO LOGIC - Handled by BigBangIntro now
        if (stage === 'INTRO') {
            // No Audio/Timeout here, it's inside the component
        }
        if (stage === 'SUN') playSound('ambient_transition');
        if (stage === 'MOON') playSound('ambient_transition');
        if (stage === 'THREAD') playSound('victory');
    }, [stage, playSound]);

    // UI ANIMATIONS (Use Web Spring)
    const uiSpring = useSpringWeb({
        opacity: stage === 'INTRO' ? 0 : 1,
        y: 0,
        from: { opacity: 0, y: 50 },
        reset: true,
        keys: [stage]
    });

    if (!dual) return <div>Errore: Contenuto non trovato per questo mondo.</div>;

    const handleBack = () => {
        playSound('click');
        if (stage === 'THREAD') setStage('MOON');
        else if (stage === 'MOON') setStage('SUN');
    };

    const handleNext = () => {
        playSound('click');
        if (stage === 'SUN') setStage('MOON');
        else if (stage === 'MOON') setStage('THREAD');
        else if (stage === 'THREAD') {
            if (content.extraModules && content.extraModules.length > 0) {
                setStage('EXTRA_0' as any);
            } else {
                onComplete();
            }
        }
        else if (typeof stage === 'string' && stage.startsWith('EXTRA_')) {
            const currentExtraIndex = parseInt(stage.split('_')[1]);
            if (content.extraModules && currentExtraIndex < content.extraModules.length - 1) {
                setStage(`EXTRA_${currentExtraIndex + 1}` as any);
            } else {
                onComplete();
            }
        }
        else onComplete();
    };

    // THEME COLORS based on Stage 
    const getTheme = () => {
        switch (stage) {
            case 'INTRO': return 'bg-black'; // Pure black for space
            case 'SUN': return 'from-amber-950/40 via-black/60 to-black';
            case 'MOON': return 'from-slate-950/40 via-black/60 to-black';
            case 'THREAD': return 'from-yellow-950/30 via-black/60 to-black';
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black text-white overflow-hidden animate-[fadeIn_1s]">

            {/* INTRO OVERLAY (Rendered top-level) */}
            {stage === 'INTRO' && (
                <BigBangIntro
                    onComplete={() => setStage('SUN')}
                    type={worldId === 1 ? 'BIG_BANG' : 'WARP'}
                />
            )}

            {/* ATMOSPHERIC BACKGROUND GRADIENT (CSS) */}
            <div className={`absolute inset-0 z-0 opacity-40 transition-colors duration-1000 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from),_transparent_70%)] ${getTheme().split(' ')[0]}`} />

            {/* --- 3D SCENE --- */}
            <div
                className="absolute inset-0 z-0 transition-transform duration-1000 scale-100"
            >
                <Canvas dpr={[1, 2]}>
                    <Suspense fallback={null}>
                        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
                        <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={stage === 'INTRO' ? 20 : 0.5} />
                        <ambientLight intensity={0.1} />

                        {/* Dramatic Lighting Key */}
                        {stage === 'SUN' && <pointLight position={[5, 2, 5]} intensity={2} color="#fbbf24" />}
                        {stage === 'MOON' && <pointLight position={[-5, 2, 5]} intensity={1.5} color="#a5f3fc" />}
                        {stage === 'THREAD' && (
                            <>
                                <pointLight position={[0, -5, 0]} intensity={4} color="#fbbf24" distance={15} />
                                <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={2} color="#fff" />
                            </>
                        )}

                        {/* Dynamic Environment */}
                        <Environment preset={stage === 'THREAD' ? "city" : (stage === 'SUN' ? "sunset" : "night")} />

                        {/* Cinematic Fog for depth */}
                        <fog attach="fog" args={['#000000', 8, 30]} />

                        {/* Transitions between Objects */}
                        <a3d.group position={[0, 0, 0]}>
                            {/* Intro handled via Overlay now */}
                            {stage === 'SUN' && <CelestialSun active={true} />}
                            {stage === 'MOON' && <CelestialMoon active={true} />}
                            {stage === 'THREAD' && <GoldenThreadTree active={true} />}
                        </a3d.group>

                    </Suspense>
                </Canvas>
            </div>

            {/* --- UI OVERLAY --- */}
            <div className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-500 ${stage === 'INTRO' ? 'opacity-0' : 'opacity-100'}`}>

                {/* Header */}
                <div className="absolute top-0 left-0 w-full z-20 flex justify-between items-center p-6 md:p-8 pointer-events-auto">
                    <button onClick={onClose} className="group flex items-center gap-3 text-white/40 hover:text-white transition-colors duration-300">
                        <div className="p-2 rounded-full border border-white/10 group-hover:border-white/40 transition-colors">
                            <ArrowLeft size={16} />
                        </div>
                        <span className="uppercase tracking-[0.2em] text-[10px] md:text-xs font-medium">Esci dal Regno</span>
                    </button>

                    {/* Minimalist Progress */}
                    <div className="flex gap-3">
                        {['SUN', 'MOON', 'THREAD'].map((s, i) => (
                            <div key={s} className={`h-1 rounded-full transition-all duration-700 ${stage === s ? 'w-8 bg-white shadow-[0_0_10px_white]' : 'w-2 bg-white/10'}`} />
                        ))}
                    </div>
                </div>

                {/* CENTRAL CONTENT CARD - Grid Centering for absolute stability */}
                <div
                    className="absolute inset-0 z-10 w-full h-full overflow-y-auto pointer-events-auto"
                    style={{ scrollbarGutter: 'stable' }}
                >
                    <div className="flex min-h-full items-center justify-center p-4 md:p-12">
                        <aWeb.div
                            style={uiSpring}
                            className={`w-full max-w-2xl rounded-3xl p-6 md:p-10 
                                        backdrop-blur-xl border border-white/10 shadow-2xl 
                                        bg-gradient-to-b from-black/40 to-black/80 
                                        flex flex-col items-center text-center
                                        relative overflow-hidden group transition-all duration-500`}
                        >
                            {/* Subtle Inner Glow Gradient */}
                            <div className={`absolute inset-0 opacity-20 bg-gradient-to-tr ${getTheme()} pointer-events-none mix-blend-screen transition-opacity duration-1000`} />

                            {/* ICON HEADER */}
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-150 opacity-20 animate-pulse" />
                                {stage === 'SUN' && <Sun size={32} className="text-amber-200 relative z-10" />}
                                {stage === 'MOON' && <Moon size={32} className="text-cyan-200 relative z-10" />}
                                {stage === 'THREAD' && <SparklesIcon size={32} className="text-amber-100 relative z-10" />}
                            </div>

                            {/* --- MEDIA PLAYER (VIDEO) --- */}
                            {activeContent?.videoUrl && (
                                <div className="w-full aspect-video rounded-lg overflow-hidden border border-white/10 shadow-lg mb-8 bg-black relative group/video">
                                    <iframe
                                        src={activeContent.videoUrl}
                                        className="w-full h-full"
                                        frameBorder="0" // keeping frameBorder purely for legacy fallback
                                        allow="autoplay; fullscreen; picture-in-picture"
                                    ></iframe>
                                </div>
                            )}

                            {/* TEXT CONTENT */}
                            <div className="relative z-10 w-full">
                                {stage === 'SUN' && (
                                    <>
                                        <h3 className="text-amber-400 uppercase tracking-[0.2em] mb-3 text-xs font-bold drop-shadow-md">Fase 1: Logos</h3>
                                        <h1 className="text-2xl md:text-3xl font-display font-medium text-white mb-4 tracking-wide">{dual.sunContent.title}</h1>
                                        <div className="w-12 h-[1px] bg-white/20 mx-auto mb-6" />
                                        <p className="text-sm md:text-base text-gray-300 font-light leading-relaxed mb-6">{dual.sunContent.technicalContent}</p>
                                        <div className="bg-amber-950/20 border border-amber-500/10 rounded-xl p-4 backdrop-blur-md">
                                            <p className="text-amber-200/90 italic text-sm font-serif">"{dual.sunContent.microLesson}"</p>
                                        </div>
                                    </>
                                )}

                                {stage === 'MOON' && (
                                    <>
                                        <h3 className="text-cyan-400 uppercase tracking-[0.2em] mb-3 text-xs font-bold drop-shadow-md">Fase 2: Pathos</h3>
                                        <h1 className="text-2xl md:text-3xl font-display font-medium text-white mb-4 tracking-wide">{dual.moonContent.title}</h1>
                                        <div className="w-12 h-[1px] bg-white/20 mx-auto mb-6" />
                                        <p className="text-sm md:text-base text-gray-300 font-light leading-relaxed mb-6">{dual.moonContent.psychologicalContent}</p>
                                        <div className="bg-cyan-950/20 border border-cyan-500/10 rounded-xl p-4 backdrop-blur-md">
                                            <h4 className="text-cyan-400/60 uppercase text-[10px] tracking-widest mb-2">Riflessione</h4>
                                            <p className="text-white/90 font-serif text-lg italic">"{dual.moonContent.guidingQuestion}"</p>
                                        </div>
                                    </>
                                )}

                                {stage === 'THREAD' && (
                                    <>
                                        <h3 className="text-purple-400 uppercase tracking-[0.2em] mb-3 text-xs font-bold drop-shadow-md">Fase 3: Praxis</h3>
                                        <h1 className="text-2xl md:text-3xl font-display font-medium text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-amber-400 mb-4 tracking-wide">Il Patto</h1>
                                        <div className="w-12 h-[1px] bg-amber-500/30 mx-auto mb-6" />
                                        <p className="text-sm md:text-base text-gray-300 font-light leading-relaxed mb-6">{dual.goldenThread.synthesisExercise}</p>
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-4 relative overflow-hidden backdrop-blur-sm">
                                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                            <p className="text-[10px] text-white/60 uppercase tracking-widest mb-2 font-medium">Output</p>
                                            <p className="text-lg md:text-xl text-white font-mono tracking-tight">{dual.goldenThread.output}</p>
                                        </div>
                                    </>
                                )}

                                {/* EXTRA MODULES RENDERING */}
                                {typeof stage === 'string' && stage.startsWith('EXTRA_') && activeContent && (
                                    <>
                                        <h3 className="text-emerald-400 uppercase tracking-[0.2em] mb-3 text-xs font-bold drop-shadow-md">
                                            Espansione: Modulo {parseInt(stage.split('_')[1]) + 4}
                                        </h3>
                                        <h1 className="text-2xl md:text-3xl font-display font-medium text-white mb-4 tracking-wide">
                                            {activeContent.title}
                                        </h1>
                                        <div className="w-12 h-[1px] bg-emerald-500/30 mx-auto mb-6" />

                                        <div
                                            className="text-sm md:text-base text-gray-300 font-light leading-relaxed mb-6 prose prose-invert max-w-none"
                                            dangerouslySetInnerHTML={{ __html: activeContent.content }}
                                        />
                                    </>
                                )}
                            </div>

                            {/* --- DOWNLOADS & RESOURCES --- */}
                            {activeContent?.downloads && activeContent.downloads.length > 0 && (
                                <div className="w-full mt-8 pt-6 border-t border-white/5">
                                    <h4 className="text-[10px] uppercase tracking-widest text-amber-100/80 font-bold drop-shadow mb-4 text-center">Toolkit Operativo</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {activeContent.downloads.map((res: any, idx: number) => (
                                            <a
                                                key={idx}
                                                href={res.url}
                                                className="flex items-center gap-3 p-3 rounded bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group/dl text-left"
                                            >
                                                <div className="p-2 bg-black/50 rounded text-gray-400 group-hover/dl:text-white transition-colors">
                                                    {res.type === 'pdf' ? <FileText size={14} /> : res.type === 'image' ? <ImageIcon size={14} /> : <Download size={14} />}
                                                </div>
                                                <span className="text-xs text-gray-300 group-hover/dl:text-white font-medium truncate">{res.label}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}



                            {/* FOOTER ACTION */}
                            <div className="relative z-10 mt-8 md:mt-10 flex items-center justify-center gap-4">
                                {stage !== 'SUN' && (
                                    <button
                                        onClick={handleBack}
                                        className="group px-6 py-3 rounded-full font-medium uppercase tracking-[0.2em] text-[10px] text-white/50 hover:text-white border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
                                    >
                                        Indietro
                                    </button>
                                )}

                                <button
                                    onClick={handleNext}
                                    className={`group relative px-10 py-3 rounded-full font-medium uppercase tracking-[0.2em] text-xs transition-all duration-500 hover:scale-105 active:scale-95 flex items-center gap-3 overflow-hidden
                                    ${stage === 'SUN' ? 'bg-white text-black hover:bg-amber-50 shadow-[0_0_20px_rgba(255,255,255,0.3)]' : ''}
                                    ${stage === 'MOON' ? 'bg-white text-black hover:bg-cyan-50 shadow-[0_0_20px_rgba(255,255,255,0.3)]' : ''}
                                    ${stage === 'THREAD' ? 'bg-gradient-to-r from-amber-200 to-amber-500 text-black shadow-[0_0_30px_rgba(251,191,36,0.5)]' : ''}
                                `}
                                >
                                    <span className="relative z-10">{stage === 'THREAD' ? 'Completa' : 'Prosegui'}</span>
                                    <div className="absolute inset-0 bg-white/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                        </aWeb.div>
                    </div>
                </div>

            </div>
        </div>
    );
};
