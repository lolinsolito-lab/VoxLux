import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, Float, Sparkles, Stars, PerspectiveCamera, useTexture } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { Crown, Download, Share2, LogOut } from 'lucide-react';
import { useAudioSystem } from '../hooks/useAudioSystem';

// --- REFLECTIONS OF THE 10 WORLDS ---
// We simulate the 10 laser beams in the 3D scene
const WorldLasers = ({ active }: { active: boolean }) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!groupRef.current || !active) return;
        groupRef.current.rotation.y += 0.02;
        // Pulse scale
        const scale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
        groupRef.current.scale.setScalar(scale);
    });

    if (!active) return null;

    const beams = new Array(10).fill(0).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        const radius = 15;
        // Colors map roughly to the 10 worlds
        const colors = ['#fbbf24', '#a855f7', '#22d3ee', '#3b82f6', '#06b6d4', '#14b8a6', '#f43f5e', '#f97316', '#ffffff', '#fbbf24'];
        return (
            <mesh key={i} position={[Math.cos(angle) * radius, (i % 2 === 0 ? 5 : -5), Math.sin(angle) * radius]} rotation={[0, -angle, 0]}>
                <cylinderGeometry args={[0.1, 0.5, radius * 2, 8]} />
                <meshBasicMaterial color={colors[i]} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
                {/* LookAt center logic would be better but simple rotation works for visual chaos */}
                <mesh position={[0, -radius, 0]}>
                    <sphereGeometry args={[0.5, 16, 16]} />
                    <meshStandardMaterial emissive={colors[i]} emissiveIntensity={2} color={colors[i]} />
                </mesh>
            </mesh>
        );
    });

    return (
        <group ref={groupRef}>
            {/* Central convergence point */}
            <mesh>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial color="white" />
            </mesh>
            {beams}
        </group>
    );
};

// --- THE ARTIFACT (DIPLOMA) ---
const Artifact = ({ visible, userName }: { visible: boolean; userName: string }) => {
    const meshRef = useRef<THREE.Group>(null);

    useSpring({
        scale: visible ? [1, 1, 1] : [0, 0, 0],
        config: { mass: 1, tension: 280, friction: 60 }
    });

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
        meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
    });

    if (!visible) return null;

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group ref={meshRef}>
                {/* The Slate (Obsidian) */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[6, 4, 0.2]} />
                    <meshPhysicalMaterial
                        color="#111"
                        roughness={0.1}
                        metalness={0.9}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                    />
                </mesh>

                {/* Gold Frame */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[6.2, 4.2, 0.1]} />
                    <meshStandardMaterial color="#fbbf24" metalness={1} roughness={0.2} />
                </mesh>

                {/* 3D Text: Title */}
                <Center position={[0, 1.2, 0.11]}>
                    <Text3D font="/fonts/inter_bold.json" size={0.3} height={0.05} curveSegments={12}>
                        VOX SEPHIRA
                        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
                    </Text3D>
                </Center>

                {/* 3D Text: Name */}
                <Center position={[0, 0.2, 0.11]}>
                    <Text3D font="/fonts/inter_bold.json" size={0.4} height={0.05} curveSegments={12}>
                        {userName.toUpperCase()}
                        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.8} />
                    </Text3D>
                </Center>

                {/* 3D Text: Subtitle */}
                <Center position={[0, -0.8, 0.11]}>
                    <Text3D font="/fonts/inter_bold.json" size={0.15} height={0.02} curveSegments={12}>
                        MAESTRO DELLA NARRAZIONE STRATEGICA
                        <meshStandardMaterial color="#fbbf24" />
                    </Text3D>
                </Center>

                {/* Seal */}
                <mesh position={[0, -1.5, 0.15]}>
                    <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} rotation={[Math.PI / 2, 0, 0]} />
                    <meshStandardMaterial color="#ef4444" roughness={0.3} />
                </mesh>
            </group>
        </Float>
    );
};

interface FinalRitualProps {
    userName: string;
    onClose: () => void;
}

export const FinalRitual: React.FC<FinalRitualProps> = ({ userName, onClose }) => {
    const [phase, setPhase] = useState<'FORGING' | 'REVEAL' | 'HANDOFF'>('FORGING');
    const { playSound } = useAudioSystem();

    useEffect(() => {
        // Sequence Director
        playSound('transition_whoosh'); // Placeholder for charging sound

        // Phase 1 -> 2
        const timer1 = setTimeout(() => {
            playSound('victory'); // Placeholder for explosion/reveal
            setPhase('REVEAL');
        }, 4000); // 4 seconds of charging

        // Phase 2 -> 3
        const timer2 = setTimeout(() => {
            setPhase('HANDOFF');
        }, 7000); // 3 seconds of reveal before UI

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [playSound]);

    const handleClaim = () => {
        playSound('click');
        // Simulate download
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'Vox_Sephira_Diploma.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Close after a delay? Or just let user close.
    };

    return (
        <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/90 animate-[fadeIn_1s]">

            {/* 3D SCENE */}
            <div className="absolute inset-0 z-0">
                <Canvas dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="#fbbf24" />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#blue" />

                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                    {/* Phase 1: Lasers */}
                    {phase === 'FORGING' && <WorldLasers active={true} />}

                    {/* Phase 2+: Artifact */}
                    <Artifact visible={phase !== 'FORGING'} userName={userName} />

                    {/* Particles */}
                    <Sparkles count={200} scale={12} size={2} speed={0.4} opacity={0.5} color="#fbbf24" />
                </Canvas>
            </div>

            {/* UI OVERLAY */}
            <div className="relative z-10 w-full max-w-4xl text-center p-8">

                {phase === 'FORGING' && (
                    <h1 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-widest animate-pulse drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]">
                        Forgiatura in corso...
                    </h1>
                )}

                {phase === 'REVEAL' && (
                    <div className="animate-[zoomIn_0.5s]">
                        <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-lux-gold via-white to-lux-gold mb-4 drop-shadow-2xl">
                            MAESTRIA
                        </h1>
                    </div>
                )}

                {phase === 'HANDOFF' && (
                    <div className="animate-[fadeInUp_1s]">
                        <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-lux-gold via-white to-lux-gold mb-8 drop-shadow-2xl">
                            MISSIONE COMPIUTA
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
                            Hai attraversato i Dieci Mondi. La tua voce è ora una leggenda incisa nella matrice.
                            <br />Il Sigillo è tuo.
                        </p>

                        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                            <button
                                onClick={handleClaim}
                                className="group relative px-12 py-5 bg-lux-gold text-black font-bold text-lg uppercase tracking-widest rounded overflow-hidden hover:scale-105 transition-transform shadow-[0_0_30px_rgba(251,191,36,0.4)]"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                <span className="relative flex items-center gap-3">
                                    <Download className="w-6 h-6" />
                                    Richiedi la tua Eredità
                                </span>
                            </button>

                            <button
                                onClick={() => { }} // Social share mock
                                className="px-8 py-5 border border-white/20 hover:bg-white/10 text-white font-bold text-sm uppercase tracking-widest rounded hover:border-white/50 transition-all flex items-center gap-3"
                            >
                                <Share2 className="w-5 h-5" />
                                Condividi Gloria
                            </button>
                        </div>

                        <div className="mt-16">
                            <button onClick={onClose} className="text-gray-500 hover:text-white text-xs uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 mx-auto">
                                <LogOut className="w-4 h-4" />
                                Torna alla dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
