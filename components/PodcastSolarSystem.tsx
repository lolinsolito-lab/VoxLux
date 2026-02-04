import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles, Float, Html, MeshDistortMaterial, MeshTransmissionMaterial, Clouds, Cloud, CameraShake } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, TiltShift, ChromaticAberration, GodRays } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useSpring, animated, config } from '@react-spring/three';
import { PODCAST_THEMES, WorldTheme } from '../services/themeRegistry';
import { Mastermind } from '../services/courseData';

// --- VISUAL CONSTANTS ---
const GOLD_COLOR = new THREE.Color('#ffaa00');
const CORE_COLOR = new THREE.Color('#fff7ed'); // Bright White-Gold Center
const NEBULA_COLOR = new THREE.Color('#4338ca'); // Indigo/Purple haze

// --- COMPONENTS ---

// 1. VOLUMETRIC ENERGY RING (The Torus)
// Replaces flat rings with 3D glass-like energy tubes
const EnergyTorus = ({ radius, speed, rotationOffset, isActive, isHovered }: { radius: number, speed: number, rotationOffset: number, isActive: boolean, isHovered: boolean }) => {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (ref.current) {
            // Slow majestic rotation
            ref.current.rotation.z += speed * 0.002;
            ref.current.rotation.x = (Math.PI / 2) + Math.sin(state.clock.getElapsedTime() * 0.2 + rotationOffset) * 0.05; // Gentle wobble
        }
    });

    const { scale, opacity } = useSpring({
        scale: isActive ? 1.02 : 1,
        opacity: isActive ? 0.8 : (isHovered ? 0.3 : 0.1),
        config: config.molasses
    });

    return (
        <group rotation={[Math.PI / 8, 0, rotationOffset]}> {/* Tilted generic alignment */}
            <animated.mesh ref={ref} scale={scale}>
                {/* Thick Torus for the "Path" */}
                <torusGeometry args={[radius, 0.08, 16, 100]} />
                {/* Glassy Transmission Material */}
                <MeshTransmissionMaterial
                    backside
                    samples={4}
                    thickness={0.5}
                    roughness={0.2}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    transmission={1}
                    ior={1.2}
                    chromaticAberration={0.05}
                    anisotropy={0.5}
                    distortion={0.2}
                    distortionScale={0.5}
                    temporalDistortion={0.1}
                    color={GOLD_COLOR}
                    emissive={GOLD_COLOR}
                    emissiveIntensity={isActive ? 2 : 0.1}
                />
            </animated.mesh>
            {/* Particle Trail within the ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[radius - 0.2, radius + 0.2, 64]} />
                <meshBasicMaterial color={GOLD_COLOR} transparent opacity={isActive ? 0.1 : 0.02} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
        </group>
    );
};

// 2. CELESTIAL PLANET (The "Artifact")
const CelestialArtifact = ({
    position,
    theme,
    index,
    onClick,
    isHovered,
    onPointerOver,
    onPointerOut
}: {
    position: [number, number, number],
    theme: WorldTheme,
    index: number,
    onClick: () => void,
    isHovered: boolean,
    onPointerOver: () => void,
    onPointerOut: () => void
}) => {
    const meshRef = useRef<THREE.Mesh>(null);

    // Spring Animation
    const { scale, distort } = useSpring({
        scale: isHovered ? 2.5 : 1.5,
        distort: isHovered ? 0.8 : 0.3,
        config: config.wobbly
    });

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
            meshRef.current.rotation.z += 0.002;
        }
    });

    const planetColor = theme.colors?.primary || '#fbbf24';

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                {/* CORE SPHERE */}
                <animated.mesh
                    ref={meshRef}
                    scale={scale}
                    onClick={(e) => { e.stopPropagation(); onClick(); }}
                    onPointerOver={(e) => { e.stopPropagation(); onPointerOver(); }}
                    onPointerOut={(e) => { e.stopPropagation(); onPointerOut(); }}
                >
                    <sphereGeometry args={[0.5, 64, 64]} />
                    <MeshDistortMaterial
                        color={planetColor}
                        emissive={planetColor}
                        emissiveIntensity={isHovered ? 1.5 : 0.2}
                        speed={2}
                        distort={distort}
                        radius={1}
                    />
                </animated.mesh>

                {/* ORBITAL MARKER (The "Select" Bracket) */}
                {isHovered && (
                    <group rotation={[0, 0, Math.PI / 4]}>
                        <mesh>
                            <ringGeometry args={[1.8, 1.9, 4]} />
                            <meshBasicMaterial color="white" transparent opacity={0.8} side={THREE.DoubleSide} />
                        </mesh>
                    </group>
                )}

                {/* LABEL */}
                <Html position={[0, -2, 0]} center distanceFactor={15} style={{ pointerEvents: 'none' }}>
                    <div className={`font-mono text-xs tracking-[0.2em] transition-all duration-300 ${isHovered ? 'text-white scale-125 font-bold shadow-black drop-shadow-md' : 'text-white/30'}`}>
                        {index + 1}
                    </div>
                </Html>
            </Float>
        </group>
    );
};

// 3. THE HYPERNOVA (Central Light)
const Hypernova = () => {
    return (
        <group>
            {/* Blinding Core */}
            <mesh>
                <sphereGeometry args={[2.5, 64, 64]} />
                <meshBasicMaterial color={CORE_COLOR} toneMapped={false} />
            </mesh>
            {/* Inner Corona */}
            <mesh scale={[1.2, 1.2, 1.2]}>
                <sphereGeometry args={[2.5, 64, 64]} />
                <meshBasicMaterial color="#fbbf24" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
            </mesh>
            {/* God Ray Blockers (Invisible, creates shadows for rays if we added them, but mainly for volume) */}
            <Sparkles count={50} scale={6} size={10} speed={0.4} opacity={0.5} color="#fff" />
        </group>
    );
};

// --- SCENE ---

const TheCosmos = ({
    courses,
    onSelectWorld,
    onHoverNode
}: {
    courses: Mastermind[],
    onSelectWorld: (id: string) => void,
    onHoverNode: (idx: number | null) => void
}) => {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    // Cinematic Logarithmic Spiral
    const planets = useMemo(() => {
        return courses.map((course, i) => {
            const angle = i * 1.1; // Wider spacing
            const radius = 7 + (i * 3.5); // Much wider spread for "Scale"
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = Math.sin(i * 0.4) * 4;

            return {
                pos: [x, y, z] as [number, number, number],
                radius: Math.sqrt(x * x + z * z), // Approx orbit radius
                theme: PODCAST_THEMES[i % PODCAST_THEMES.length],
                data: course,
                index: i
            };
        });
    }, [courses]);

    return (
        <>
            {/* 1. ATMOSPHERE & BACKGROUND */}
            <color attach="background" args={['#020205']} /> {/* Deep Space Blue-Black */}
            <ambientLight intensity={0.2} color="#4338ca" /> {/* Purple Ambient */}
            <pointLight position={[0, 0, 0]} intensity={5} color="#ffaa00" decay={2} distance={100} /> {/* Sun */}

            <Stars radius={300} depth={100} count={10000} factor={6} saturation={0.8} fade speed={1} />

            {/* NEBULA CLOUDS (Volumetric Feel) */}
            <Clouds material={THREE.MeshBasicMaterial}>
                <Cloud segments={20} bounds={[30, 10, 30]} volume={20} color="#4338ca" fade={100} opacity={0.1} />
                <Cloud seed={1} scale={2} volume={10} color="#fbbf24" fade={100} opacity={0.05} position={[10, 0, -10]} />
            </Clouds>

            {/* 2. THE CORE */}
            <Hypernova />

            {/* 3. RINGS */}
            {planets.map((p, i) => (
                <EnergyTorus
                    key={`torus-${i}`}
                    radius={p.radius}
                    speed={10 - i}
                    rotationOffset={i * 0.5}
                    isActive={hoveredIdx === i}
                    isHovered={hoveredIdx === i} // Pass hover state to light up the ring
                />
            ))}

            {/* 4. PLANETS */}
            {planets.map((p, i) => (
                <CelestialArtifact
                    key={i}
                    position={p.pos}
                    theme={p.theme}
                    index={p.index}
                    onClick={() => onSelectWorld(p.data.id)}
                    isHovered={hoveredIdx === i}
                    onPointerOver={() => { setHoveredIdx(i); onHoverNode(i); }}
                    onPointerOut={() => { setHoveredIdx(null); onHoverNode(null); }}
                />
            ))}

            {/* 5. CAMERA & POST FX */}
            <CameraShake yawFrequency={0.05} pitchFrequency={0.05} rollFrequency={0.05} intensity={0.2} />

            <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={0.8} mipmapBlur intensity={1.5} radius={0.5} />
                <Noise opacity={0.05} />
                <Vignette eskil={false} offset={0.1} darkness={0.7} />
                <TiltShift blur={0.1} />
                <ChromaticAberration offset={[0.001, 0.001]} />
            </EffectComposer>

            <OrbitControls
                enableZoom={true}
                minDistance={15}
                maxDistance={60}
                enablePan={false}
                autoRotate={!hoveredIdx}
                autoRotateSpeed={0.3}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 3}
            />
        </>
    );
};

export const PodcastSolarSystem = ({
    masterminds,
    onSelectWorld
}: {
    masterminds: Mastermind[],
    onSelectWorld: (id: string) => void
}) => {
    const [hoveredNodeName, setHoveredNodeName] = useState<string | null>(null);

    return (
        <div className="w-full h-full relative">
            <Canvas camera={{ position: [0, 20, 45], fov: 45 }} dpr={[1, 2]}>
                <TheCosmos
                    courses={masterminds}
                    onSelectWorld={onSelectWorld}
                    onHoverNode={(idx) => {
                        if (idx !== null) {
                            setHoveredNodeName(PODCAST_THEMES[idx % PODCAST_THEMES.length].name);
                        } else {
                            setHoveredNodeName(null);
                        }
                    }}
                />
            </Canvas>

            {/* LEGEND / HUD - Only visible when hovering */}
            <div className={`absolute bottom-10 left-10 pointer-events-none transition-opacity duration-500 ${hoveredNodeName ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-black/50 backdrop-blur-xl border border-white/10 p-4 rounded-lg">
                    <h2 className="text-white font-display text-2xl tracking-widest uppercase">{hoveredNodeName}</h2>
                </div>
            </div>
        </div>
    );
};
