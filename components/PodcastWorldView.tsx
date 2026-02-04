import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float, Sparkles, Html, MeshDistortMaterial, MeshTransmissionMaterial, QuadraticBezierLine } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useSpring as useSpringWeb, animated as aWeb } from '@react-spring/web';
import { useSpring as useSpring3d, animated as a3d } from '@react-spring/three';
import { WorldContent } from '../services/courses/types';
import { useAudioSystem } from '../hooks/useAudioSystem';
import { ArrowLeft, ArrowRight, Play, FileDown, Mic, Disc, Podcast, Zap, Maximize2, X } from 'lucide-react';
import { FusedWarp } from './FusedWarp';
import { PODCAST_THEMES } from '../content/podcast/themes';

// --- VISUAL COMPONENTS ---

// Represents the Microphone with an "Eclipse" effect + Dynamic Flash
const MicCore = ({ trigger, color, scale }: { trigger: number, color: string, scale: number }) => {
    const groupRef = useRef<THREE.Group>(null);

    const springProps = useSpring3d({
        flashIntensity: 0,
        rimColor: color, // Dynamic Theme Color
        to: async (next) => {
            await next({ flashIntensity: 8, rimColor: '#ffffff', config: { duration: 100 } });
            await next({ flashIntensity: 0.5, rimColor: color, config: { duration: 800 } });
        },
        from: { flashIntensity: 0.5, rimColor: color },
        reset: true,
        keys: [trigger, color]
    });

    const flashIntensity = springProps.flashIntensity;
    const rimColor = springProps.rimColor;

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        }
    });

    return (
        <group ref={groupRef} scale={scale}>
            {/* BACKLIGHT */}
            <pointLight position={[0, 0, -2]} intensity={8} color={color} distance={5} />

            {/* DYNAMIC FRONT FLASH LIGHT */}
            <a3d.pointLight position={[0, 1, 3]} intensity={flashIntensity} color="white" distance={8} />

            {/* MIC HEAD */}
            <mesh position={[0, 0.8, 0]}>
                <sphereGeometry args={[0.7, 64, 64]} />
                <a3d.meshStandardMaterial
                    color="#111"
                    roughness={0.4}
                    metalness={0.8}
                    emissive="#4338ca"
                    emissiveIntensity={0.2}
                />
            </mesh>

            {/* MIC BODY */}
            <mesh position={[0, -0.2, 0]}>
                <cylinderGeometry args={[0.25, 0.2, 1.8, 32]} />
                <meshStandardMaterial
                    color="#222"
                    roughness={0.3}
                    metalness={0.9}
                />
            </mesh>

            {/* RIM/CORONA EFFECT */}
            <a3d.mesh position={[0, 0.8, -0.1]} scale={[1.15, 1.15, 1.15]}>
                <sphereGeometry args={[0.7, 32, 32]} />
                <a3d.meshBasicMaterial
                    color={rimColor}
                    transparent
                    opacity={0.3}
                    side={THREE.BackSide}
                />
            </a3d.mesh>

            {/* Particles match theme */}
            <Sparkles count={50} scale={4} size={4} speed={0.4} opacity={0.5} color={color} />
        </group>
    );
};

// Represents the connection between the Voice (Core) and the Topic (Planet)
const NeuralBeam = ({ start, end, active }: { start: [number, number, number], end: [number, number, number], active: boolean }) => {
    const { color } = useSpring3d({
        color: active ? '#8b5cf6' : '#000000',
        config: { duration: 500 }
    });

    if (!active) return null;

    return (
        <group>
            <QuadraticBezierLine
                start={start}
                end={end}
                mid={[
                    (start[0] + end[0]) / 2,
                    (start[1] + end[1]) / 2 + 2,
                    (start[2] + end[2]) / 2
                ]}
                color="#c4b5fd"
                lineWidth={3}
                transparent
                opacity={0.6}
            />
        </group>
    );
};

const PlanetaryBody = ({ position, type, active, label, onClick }: { position: [number, number, number], type: 'sun' | 'moon' | 'signal', active: boolean, label: string, onClick?: () => void }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
        }
        if (groupRef.current) {
            groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
        }
    });

    const { scale, emissiveIntensity } = useSpring3d({
        scale: active ? 1.5 : 0.8,
        emissiveIntensity: active ? 3 : 0.5,
        config: { tension: 180, friction: 12 }
    });

    return (
        <group ref={groupRef} position={position as any} onClick={onClick}>
            <a3d.mesh ref={meshRef} scale={scale}>
                <sphereGeometry args={[0.7, 64, 64]} />

                {active && <pointLight distance={8} intensity={3} color={type === 'sun' ? '#f59e0b' : type === 'moon' ? '#cbd5e1' : '#10b981'} />}

                {/* DISTINCT SHADERS PER PLANET */}
                {type === 'sun' && (
                    <MeshDistortMaterial
                        color="#fbbf24"
                        emissive="#d97706"
                        emissiveIntensity={2}
                        distort={0.15}
                        speed={1.2}
                        roughness={0.1}
                        metalness={0.8}
                    />
                )}

                {type === 'moon' && (
                    <MeshTransmissionMaterial
                        backside
                        samples={4}
                        thickness={0.5}
                        chromaticAberration={0.1}
                        anisotropy={0.1}
                        distortion={0.1}
                        distortionScale={0.1}
                        temporalDistortion={0.1}
                        color="#e2e8f0"
                        roughness={0.1}
                        metalness={0.2}
                    />
                )}

                {type === 'signal' && (
                    <meshStandardMaterial
                        color="#10b981"
                        emissive="#059669"
                        emissiveIntensity={active ? 3 : 0.5}
                        wireframe={true}
                        roughness={0}
                        metalness={1}
                    />
                )}
            </a3d.mesh>

            {/* Internal Core for Glassy Objects (Moon/Signal) */}
            {type !== 'sun' && (
                <mesh scale={[0.5, 0.5, 0.5]}>
                    <sphereGeometry args={[0.7, 32, 32]} />
                    <meshBasicMaterial color={type === 'moon' ? '#fff' : '#059669'} />
                </mesh>
            )}

            {/* Orbital Ring Visual */}
            <mesh rotation={[Math.PI / 2.2, 0, 0]}>
                <ringGeometry args={[0.9, 0.95, 64]} />
                <meshBasicMaterial color={type === 'sun' ? 'orange' : type === 'moon' ? 'white' : 'green'} transparent opacity={active ? 0.6 : 0.2} side={THREE.DoubleSide} />
            </mesh>

            {/* CONNECTION BEAM */}
            <NeuralBeam start={[0, 0, 0]} end={position as any} active={active} />

            {/* Label */}
            <Html position={[0, 1.4, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
                <div className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'text-white/30'} whitespace-nowrap transition-all duration-500`}>
                    {label}
                </div>
            </Html>
        </group>
    );
};

const OrbitCamera = ({ targetAngle, radius }: { targetAngle: number, radius: number }) => {
    const { camera } = useThree();
    const currentAngleRef = useRef(0);

    useFrame(() => {
        // Smooth lerp to target angle
        currentAngleRef.current = THREE.MathUtils.lerp(currentAngleRef.current, targetAngle, 0.04);
        const x = Math.sin(currentAngleRef.current) * radius;
        const z = Math.cos(currentAngleRef.current) * radius;
        camera.position.set(x, 2, z);
        camera.lookAt(0, 0, 0);
    });
    return null;
};

// READ MODE MODAL - LUXURY EDITION
const ReadingModal = ({ active, onClose, content, type }: { active: boolean, onClose: () => void, content: any, type: string }) => {
    const fadeProps = useSpringWeb({
        opacity: active ? 1 : 0,
        pointerEvents: active ? 'auto' : 'none',
        from: { opacity: 0 },
        config: { duration: 400 }
    });

    const slideProps = useSpringWeb({
        y: active ? 0 : 30,
        scale: active ? 1 : 0.98,
        from: { y: 30, scale: 0.98 },
        config: { tension: 280, friction: 60 }
    });

    // Icon mapping
    const Icon = type === 'sun' ? Mic : type === 'moon' ? Disc : Podcast;
    const themeColor = type === 'sun' ? 'text-amber-400' : type === 'moon' ? 'text-cyan-400' : 'text-emerald-400';
    const borderColor = type === 'sun' ? 'border-amber-500/20' : type === 'moon' ? 'border-cyan-500/20' : 'border-emerald-500/20';
    const bgGradient = type === 'sun' ? 'from-amber-900/20' : type === 'moon' ? 'from-cyan-900/20' : 'from-emerald-900/20';

    return (
        <aWeb.div style={fadeProps as any} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 md:p-8">
            <aWeb.div style={slideProps as any} className={`w-full max-w-4xl bg-gradient-to-br from-[#0a0a0a] to-[#000000] border ${borderColor} rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] relative`}>

                {/* Ambient Glow */}
                <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b ${bgGradient} to-transparent opacity-30 blur-[120px] pointer-events-none rounded-full -translate-y-1/2 translate-x-1/2`} />

                {/* Header */}
                <div className="p-8 border-b border-white/5 flex justify-between items-start bg-white/2 backdrop-blur-md relative z-10 shrink-0">
                    <div className="flex items-start gap-6">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/10 shadow-lg ${themeColor}`}>
                            <Icon size={28} />
                        </div>
                        <div className="pt-1">
                            <h3 className={`text-xs font-bold uppercase tracking-[0.2em] mb-2 ${themeColor} opacity-80`}>Modalità Lettura</h3>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">{content?.title}</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full transition-all text-white/50 hover:text-white hover:scale-110 active:scale-95 group">
                        <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar leading-relaxed text-gray-300 space-y-10 relative z-10">

                    {/* UNIVERSITY STRUCTURE RENDERING */}
                    {content?.segments && content.segments.length > 0 ? (
                        <div className="space-y-12">
                            {content.segments.map((seg: any, idx: number) => (
                                <div key={idx} className="relative pl-6 md:pl-0">
                                    {/* Timeline Line for University Feel */}
                                    <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/20 to-transparent md:hidden"></div>

                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Seg Number */}
                                        <div className="hidden md:flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold ${themeColor} mb-2`}>{idx + 1}</div>
                                            <div className="flex-1 w-[1px] bg-white/5"></div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className={`text-[10px] items-center px-2 py-1 rounded border border-white/10 ${themeColor} uppercase tracking-widest bg-white/5`}>
                                                    {seg.type === 'theory' && 'Teoria'}
                                                    {seg.type === 'case-study' && 'Case Study'}
                                                    {seg.type === 'workshop' && 'Workshop'}
                                                    {seg.type === 'framework' && 'Framework'}
                                                </span>
                                                <h3 className="text-xl font-bold text-white font-display">{seg.title}</h3>
                                            </div>

                                            {seg.image && (
                                                <div className="mb-6 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                                    <img src={seg.image} alt={seg.title} className="w-full h-auto object-cover" />
                                                </div>
                                            )}

                                            <div className="prose prose-invert prose-sm max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: seg.content }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* FALLBACK FOR LEGACY CONTENT */
                        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-gray-300 prose-p:font-light prose-strong:text-white prose-strong:font-bold">
                            <p className="text-xl leading-8 text-gray-200 font-serif italic border-l-2 border-white/10 pl-6 my-8">
                                {content?.technicalContent || content?.psychologicalContent || content?.synthesisExercise}
                            </p>

                            {content?.longText && (
                                <div dangerouslySetInnerHTML={{ __html: content.longText }} />
                            )}
                        </div>
                    )}

                    {/* Rich Media Placeholders (Legacy Support) */}
                    {content?.featuredImage && !content?.segments && (
                        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                            <img src={content.featuredImage} alt="Content visual" className="w-full h-auto object-cover" />
                        </div>
                    )}

                    {/* Downloads Section */}
                    {content?.downloads && content.downloads.length > 0 && (
                        <div className="bg-gradient-to-r from-white/5 to-transparent rounded-2xl p-8 border border-white/5 relative overflow-hidden">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${bgGradient.replace('from-', 'from-').replace('/20', '')} to-transparent`} />

                            <h4 className="flex items-center gap-3 text-sm font-bold text-white uppercase tracking-widest mb-6">
                                <FileDown size={18} className={themeColor} />
                                Risorse Scaricabili
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {content.downloads.map((dl: any, i: number) => (
                                    <a key={i} href={dl.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-black/40 hover:bg-white/5 border border-white/10 hover:border-white/20 rounded-xl group transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-white/5 text-violet-300">
                                                <FileDown size={20} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{dl.label}</span>
                                        </div>
                                        <ArrowRight size={16} className="text-white/20 group-hover:text-white -translate-x-2 group-hover:translate-x-0 transition-transform" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </aWeb.div>
        </aWeb.div>
    );
};

interface PodcastWorldViewProps {
    worldId: number;
    content: WorldContent;
    onClose: () => void;
    onComplete: () => void;
}

export const PodcastWorldView: React.FC<PodcastWorldViewProps> = ({ worldId, content, onClose, onComplete }) => {
    const [stage, setStage] = useState<'INTRO' | 'ORBIT'>('INTRO');
    const [orbitIndex, setOrbitIndex] = useState(0);
    const [isReading, setIsReading] = useState(false);
    const { playSound } = useAudioSystem();
    const dual = content.dualModules;

    const theme = PODCAST_THEMES[worldId] || PODCAST_THEMES[1];

    const activeContent: any = orbitIndex === 0 ? dual.sunContent : orbitIndex === 1 ? dual.moonContent : dual.goldenThread;
    const activeType = orbitIndex === 0 ? 'sun' : orbitIndex === 1 ? 'moon' : 'signal';
    const ORBIT_ANGLES = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];

    // INTRO LOGIC
    useEffect(() => {
        if (stage === 'INTRO') {
            const timer = setTimeout(() => {
                setStage('ORBIT');
                playSound('transition_whoosh');
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [stage, playSound]);

    useEffect(() => {
        if (stage === 'ORBIT') playSound('transition_whoosh');
    }, [orbitIndex, stage, playSound]);

    const handleNext = () => {
        if (orbitIndex < 2) setOrbitIndex(prev => prev + 1);
        else onComplete();
    };

    const handleBack = () => {
        if (orbitIndex > 0) setOrbitIndex(prev => prev - 1);
    };

    const uiSpring = useSpringWeb({
        opacity: stage === 'INTRO' ? 0 : 1,
        y: 0,
        from: { opacity: 0, y: 50 },
        reset: true,
        keys: [stage, orbitIndex]
    });

    return (
        <div className="fixed inset-0 z-50 bg-black text-white font-sans overflow-hidden">

            <ReadingModal
                active={isReading}
                onClose={() => setIsReading(false)}
                content={activeContent}
                type={activeType}
            />

            <div className="absolute inset-0 z-0">
                <Canvas>
                    <ambientLight intensity={0.2} />

                    {stage === 'INTRO' ? (
                        <FusedWarp active={stage === 'INTRO'} />
                    ) : (
                        <>
                            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                            <OrbitCamera targetAngle={ORBIT_ANGLES[orbitIndex]} radius={theme.orbitRadius + 4} />

                            {/* THE ECLIPSE MIC CORE */}
                            <MicCore trigger={orbitIndex} color={theme.primaryColor} scale={theme.coreScale} />

                            {/* PLANET 1 */}
                            <PlanetaryBody
                                position={[0, 0, theme.orbitRadius]}
                                type="sun"
                                active={orbitIndex === 0}
                                label="Fase 1: Logica"
                                onClick={() => setOrbitIndex(0)}
                            />
                            {/* PLANET 2 */}
                            <PlanetaryBody
                                position={[Math.sin(ORBIT_ANGLES[1]) * theme.orbitRadius, 0, Math.cos(ORBIT_ANGLES[1]) * theme.orbitRadius]}
                                type="moon"
                                active={orbitIndex === 1}
                                label="Fase 2: Rituale"
                                onClick={() => setOrbitIndex(1)}
                            />
                            {/* PLANET 3 */}
                            <PlanetaryBody
                                position={[Math.sin(ORBIT_ANGLES[2]) * theme.orbitRadius, 0, Math.cos(ORBIT_ANGLES[2]) * theme.orbitRadius]}
                                type="signal"
                                active={orbitIndex === 2}
                                label="Fase 3: Output"
                                onClick={() => setOrbitIndex(2)}
                            />

                            <Sparkles count={200} scale={15} size={2} speed={0.2} opacity={0.3} color={theme.secondaryColor} />

                            <EffectComposer disableNormalPass>
                                <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.5} />
                                <Noise opacity={0.05} />
                                <Vignette eskil={false} offset={0.1} darkness={1.1} />
                            </EffectComposer>
                        </>
                    )}
                </Canvas>
            </div>

            {/* UI OVERLAY */}
            <div className={`absolute inset-0 z-10 pointer-events-none flex flex-col transition-opacity duration-1000 ${stage === 'INTRO' ? 'opacity-0' : 'opacity-100'}`}>
                {/* HEADER */}
                <div className="p-8 flex justify-between items-start">
                    <div>
                        <h2 className="text-sm font-bold tracking-widest text-violet-400 opacity-60">PODCAST MASTERMIND</h2>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 tracking-tighter drop-shadow-lg">
                            {content.narrative.intro?.split('.')[0] || `Mondo ${worldId}`}
                        </h1>
                    </div>
                    <button onClick={onClose} className="pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-3 hover:bg-white/10 transition-all group">
                        <ArrowLeft className="w-6 h-6 text-white/50 group-hover:text-white" />
                    </button>
                </div>

                {/* MAIN CONTENT CARD */}
                <div className="flex-1 flex items-center justify-center p-4 md:p-12 relative">
                    <aWeb.div style={uiSpring} className="relative w-full max-w-5xl pointer-events-auto">
                        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
                            {/* Glow Lines */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50"></div>

                            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[60vh]">
                                {/* LEFT: Media Player */}
                                <div className="md:col-span-7 bg-black/40 p-6 md:p-8 flex flex-col justify-center border-r border-white/5">
                                    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 relative group">
                                        {activeContent?.videoUrl ? (
                                            <iframe
                                                src={activeContent.videoUrl}
                                                className="w-full h-full"
                                                allow="autoplay; fullscreen; picture-in-picture"
                                            ></iframe>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-white/30">
                                                <Disc size={48} className="mb-4 animate-spin-slow" />
                                                <span className="text-xs uppercase tracking-widest">Video Segnale Assente</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* RIGHT: Content & Ritual */}
                                <div className="md:col-span-5 p-8 flex flex-col relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-32 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                                    <div className="relative z-10 flex-1 flex flex-col">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                                {orbitIndex === 0 && <Mic size={20} className="text-cyan-400" />}
                                                {orbitIndex === 1 && <Disc size={20} className="text-emerald-400" />}
                                                {orbitIndex === 2 && <Podcast size={20} className="text-amber-400" />}
                                            </div>
                                            <div className="flex-1 min-w-0 pr-4">
                                                <h3 className="text-xs uppercase tracking-widest text-white/40 mb-1">
                                                    Orbita {orbitIndex + 1}
                                                </h3>
                                                <h2 className="text-2xl font-bold font-display text-white leading-tight break-words">
                                                    {activeContent?.title}
                                                </h2>
                                            </div>
                                            {/* EXPAND BUTTON */}
                                            <button
                                                onClick={() => setIsReading(true)}
                                                className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/20 hover:text-cyan-400 transition-all group-hover:scale-110"
                                                title="Modalità Lettura"
                                            >
                                                <Maximize2 size={18} className="text-white/60 group-hover:text-cyan-400" />
                                            </button>
                                        </div>

                                        <div className="prose prose-invert prose-sm mb-8 leading-relaxed text-gray-300 line-clamp-6 relative">
                                            <p>{activeContent?.technicalContent || activeContent?.psychologicalContent || activeContent?.synthesisExercise}</p>
                                            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                                        </div>

                                        {/* Downloads */}
                                        {activeContent?.downloads && activeContent.downloads.length > 0 && (
                                            <div className="mt-auto mb-8">
                                                <h4 className="text-[10px] uppercase tracking-widest text-white/30 mb-3 font-bold">Trasmissioni Intercettate</h4>
                                                <div className="space-y-2">
                                                    {activeContent.downloads.slice(0, 2).map((dl: any, i: number) => (
                                                        <a key={i} href={dl.url} target="_blank" rel="noopener noreferrer" className="block p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-violet-500/30 rounded-lg transition-all group flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <FileDown size={14} className="text-violet-400" />
                                                                <span className="text-sm text-gray-300 group-hover:text-white transition-colors truncate max-w-[150px]">{dl.label}</span>
                                                            </div>
                                                            <ArrowRight size={12} className="text-white/20 group-hover:text-violet-400 -translate-x-2 group-hover:translate-x-0 transition-transform" />
                                                        </a>
                                                    ))}
                                                    {activeContent.downloads.length > 2 && (
                                                        <button onClick={() => setIsReading(true)} className="text-[10px] text-white/40 hover:text-white uppercase tracking-widest w-full text-center py-1">
                                                            + Vedi tutte le risorse
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Navigation */}
                                        <div className="flex gap-4 pt-6 border-t border-white/10">
                                            {orbitIndex > 0 && (
                                                <button
                                                    onClick={handleBack}
                                                    className="flex-1 py-4 rounded-xl border border-white/20 text-white/60 hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                                                >
                                                    <ArrowLeft size={14} /> Orbita {orbitIndex}
                                                </button>
                                            )}

                                            <button
                                                onClick={handleNext}
                                                className="flex-1 py-4 bg-white text-black hover:bg-violet-50 transition-all rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-violet-500/20"
                                            >
                                                {orbitIndex < 2 ? `Orbita ${orbitIndex + 2}` : 'Completa Sistema'} <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aWeb.div>
                </div>
            </div>
        </div>
    );
};
