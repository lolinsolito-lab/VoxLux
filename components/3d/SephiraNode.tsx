import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
// @ts-ignore
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture';

interface SephiraNodeProps {
    id: string;
    index: number;
    position: [number, number, number];
    label: string;
    description: string;
    isLocked: boolean;
    isActive: boolean;
    isComplete: boolean;
    onClick: (id: string) => void;
    playHoverSound?: () => void;
    playClickSound?: () => void;
}

const getTierColor = (index: number) => {
    // WORLD COLORS MAPPING
    const colors = [
        '#fbbf24', // World 1: Gold (Origine)
        '#a855f7', // World 2: Purple (Presenza)
        '#22d3ee', // World 3: Cyan (Visione)
        '#facc15', // World 4: Yellow (Frequenza)
    ];
    return colors[index] || '#fbbf24';
};

export const SephiraNode: React.FC<SephiraNodeProps> = ({
    id, index, position, label, description,
    isLocked, isActive, isComplete, onClick, playHoverSound, playClickSound
}) => {
    const groupRef = useRef<THREE.Group>(null);
    const ring1Ref = useRef<THREE.Mesh>(null);
    const ring2Ref = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useCursor(hovered && !isLocked);
    const tierColor = getTierColor(index);

    const { scale } = useSpring({
        from: { scale: 0 },
        to: { scale: 1 },
        delay: index * 50,
        config: { mass: 1, tension: 200, friction: 15 }
    });

    const anim = useMemo(() => ({
        speed: 1 + Math.random() * 0.5,
        dir: index % 2 === 0 ? 1 : -1
    }), [index]);

    const sphereMeshRef = useRef<THREE.Mesh>(null);
    const sphereMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);

    // Create Obsidian Texture (Flakes) for realism and to show rotation
    const obsidianTexture = useMemo(() => {
        // @ts-ignore
        const texture = new THREE.CanvasTexture(new FlakesTexture());
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);
        return texture;
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // 1. FLOAT
        if (groupRef.current) {
            groupRef.current.position.y = position[1] + Math.sin(t * 0.5 + index) * 0.05;
        }

        // 2. RINGS SPINNING (Active and visible)
        if (!isLocked) {
            // Speed x3 as requested (1.5 -> 4.5, 1.0 -> 3.0)
            if (ring1Ref.current) ring1Ref.current.rotation.z = t * 4.5 * anim.dir;
            if (ring2Ref.current) ring2Ref.current.rotation.z = t * 3.0 * -anim.dir;
            // Add slight wobble
            if (ring2Ref.current) ring2Ref.current.rotation.x = Math.PI / 1.8 + Math.sin(t) * 0.1;

            // 3. SPHERE ROTATION ("World spinning") - Harmony with rings
            // Spinning slowly in reverse to rings for contrast
            if (sphereMeshRef.current) {
                sphereMeshRef.current.rotation.y = t * 0.5 * -anim.dir; // Spin on Y axis
                sphereMeshRef.current.rotation.z = t * 0.1; // Slight tilt rotation
            }
        } else {
            // Idle slow
            if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.2;
            if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.2;
            if (sphereMeshRef.current) sphereMeshRef.current.rotation.y = t * 0.05;
        }
    });

    const locked = isLocked;

    return (
        <animated.group
            ref={groupRef}
            position={position}
            scale={scale.to(s => s * (hovered ? 1.1 : 1))}
            onClick={(e) => { e.stopPropagation(); if (!locked) { onClick(id); playClickSound?.(); } }}
            onPointerOver={() => { setHovered(true); if (!locked) playHoverSound?.(); }}
            onPointerOut={() => setHovered(false)}
        >

            {/* 1. MINIMALIST DARK SPHERE (PURE OBSIDIAN - NO GLOW) */}
            <mesh ref={sphereMeshRef}>
                <sphereGeometry args={[0.42, 64, 64]} />
                <meshPhysicalMaterial
                    ref={sphereMaterialRef}
                    color="#000000" // Pure black
                    roughness={0.15} // Slightly rougher to catch light on flakes
                    metalness={0.9}
                    normalMap={obsidianTexture} // The texture makes the rotation visible
                    normalScale={new THREE.Vector2(0.15, 0.15)} // Subtle bumps
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    emissive="#000000"
                    emissiveIntensity={0}
                />
            </mesh>

            {/* 2. COLORED RINGS (Refined - THICKER & BRIGHTER) */}
            <mesh ref={ring1Ref} rotation={[Math.PI / 2.1, 0, 0]}>
                <torusGeometry args={[0.55, 0.02, 16, 64]} />
                <meshStandardMaterial
                    color={tierColor}
                    emissive={tierColor}
                    emissiveIntensity={2.0}
                    metalness={1}
                    roughness={0.1}
                />
            </mesh>

            <mesh ref={ring2Ref} rotation={[Math.PI / 1.8, Math.PI / 6, 0]}>
                <torusGeometry args={[0.50, 0.015, 16, 64]} />
                <meshStandardMaterial
                    color={tierColor}
                    emissive={tierColor}
                    emissiveIntensity={1.5}
                    metalness={1}
                    roughness={0.1}
                />
            </mesh>

            {/* REMOVED: Center Dot & Internal Light to ensure total darkness as requested */}

            {/* TOOLTIP */}
            {hovered && (
                <Html distanceFactor={8} position={[0, 0.8, 0]} center pointerEvents="none">
                    <div className={`px-4 py-2 rounded-sm text-center backdrop-blur-md border border-white/5
                        ${locked ? 'bg-black/90' : 'bg-black/80 shadow-lg'}
                        animate-in fade-in zoom-in-95 duration-300`}>
                        <div className="text-[8px] text-gray-500 uppercase tracking-[0.3em] font-light">{label}</div>
                    </div>
                </Html>
            )}
        </animated.group>
    );
};
