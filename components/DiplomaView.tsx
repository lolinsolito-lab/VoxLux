import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Sparkles } from '@react-three/drei';
import { ArrowLeft } from 'lucide-react';
import { useAudioSystem } from '../hooks/useAudioSystem';
import { UniversalDiplomaCard } from './UniversalDiplomaCard';
import { HyperTunnel } from './HyperTunnel';
import * as THREE from 'three';

// --- STORYTELLING: WORLD LASERS (Legacy 3D Forge) ---
const WorldLasers = ({ active }: { active: boolean }) => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (!groupRef.current || !active) return;
        groupRef.current.rotation.y += 0.02;
        const scale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
        groupRef.current.scale.setScalar(scale);
    });
    if (!active) return null;
    const beams = new Array(10).fill(0).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        const radius = 15;
        const colors = ['#fbbf24', '#a855f7', '#22d3ee', '#3b82f6', '#06b6d4', '#14b8a6', '#f43f5e', '#f97316', '#ffffff', '#fbbf24'];
        return (
            <mesh key={i} position={[Math.cos(angle) * radius, (i % 2 === 0 ? 5 : -5), Math.sin(angle) * radius]} rotation={[0, -angle, 0]}>
                <cylinderGeometry args={[0.1, 0.5, radius * 2, 8]} />
                <meshBasicMaterial color={colors[i]} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
                <mesh position={[0, -radius, 0]}>
                    <sphereGeometry args={[0.5, 16, 16]} />
                    <meshStandardMaterial emissive={colors[i]} emissiveIntensity={2} color={colors[i]} />
                </mesh>
            </mesh>
        );
    });
    return (
        <group ref={groupRef}>
            <mesh>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial color="white" />
            </mesh>
            {beams}
        </group>
    );
};

interface DiplomaViewProps {
    userName: string;
    onClose: () => void;
    courseId: string;
}

export const DiplomaView: React.FC<DiplomaViewProps> = ({ userName, onClose, courseId }) => {
    const { playSound } = useAudioSystem();
    const [phase, setPhase] = useState<'FORGING' | 'REVEAL'>('FORGING');
    const isPodcast = courseId === 'matrice-2';

    useEffect(() => {
        // Sound & Timing
        const introSound = isPodcast ? 'glitch_transition' : 'transition_whoosh'; // Use closest available
        playSound(introSound);

        // Tunnel for Podcast needs a bit more time for "Hyper Jump" feel
        const duration = isPodcast ? 5000 : 4000;

        const timer = setTimeout(() => {
            playSound('victory');
            setPhase('REVEAL');
        }, duration);

        return () => clearTimeout(timer);
    }, [courseId, playSound, isPodcast]);

    return (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center animate-[fadeIn_0.5s]">

            {/* --- PHASE 1: FORGING ANIMATION (3D) --- */}
            {phase === 'FORGING' && (
                <div className="absolute inset-0 pointer-events-none">
                    <Canvas dpr={[1, 2]}>
                        <Suspense fallback={null}>
                            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                            <Environment preset="city" />
                            <ambientLight intensity={0.5} />

                            {isPodcast ? (
                                // PODCAST: HYPER TUNNEL
                                <HyperTunnel active={true} />
                            ) : (
                                // STORYTELLING: WORLD LASERS
                                <>
                                    <WorldLasers active={true} />
                                    <Sparkles count={200} scale={15} size={3} color="#ffcc00" speed={0.5} />
                                </>
                            )}
                        </Suspense>
                    </Canvas>

                    {/* OVERLAY TEXT */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className={`text-4xl md:text-6xl font-bold uppercase tracking-widest animate-pulse drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] ${isPodcast ? 'text-cyan-400 font-mono' : 'text-amber-400 font-serif'}`}>
                            {isPodcast ? "Sintetizzando Frequenza..." : "Forgiatura in Corso..."}
                        </h1>
                    </div>
                </div>
            )}

            {/* --- PHASE 2: REVEAL (2D UNIVERSAL CARD) --- */}
            {phase === 'REVEAL' && (
                <div className="relative z-50 w-full h-full flex flex-col items-center justify-center p-4 animate-[fadeInUp_0.8s]">
                    <UniversalDiplomaCard
                        userName={userName}
                        courseId={courseId}
                    />

                    <button
                        onClick={onClose}
                        className="mt-8 text-white/50 hover:text-white uppercase tracking-widest text-xs flex items-center gap-2 pointer-events-auto transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Torna al Portale
                    </button>
                </div>
            )}

        </div>
    );
};
