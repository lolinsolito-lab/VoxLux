import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Sparkles, Environment, ContactShadows } from '@react-three/drei';
import { SephiraNode } from './SephiraNode';
import { ConstellationConnections } from './ConstellationConnections';
import { Mastermind } from '../../services/courseData';
import { WORLD_THEMES } from '../../services/themeRegistry';

interface StorytellingGalaxyProps {
    masterminds: Mastermind[];
    completedModules: Set<string>;
    onSelectWorld: (id: string) => void;
    playHoverSound?: () => void;
    playClickSound?: () => void;
}

export const StorytellingGalaxy: React.FC<StorytellingGalaxyProps> = ({
    masterminds,
    completedModules,
    onSelectWorld,
    playHoverSound,
    playClickSound
}) => {

    // TREE OF LIFE LAYOUT - Compact for responsive viewing
    const NODE_POSITIONS: Record<string, [number, number, number]> = {
        'm1-1': [0, -3.2, 0],           // Base
        'm1-2': [-1.8, -1.8, 0], 'm1-3': [0, -1.4, 0.2], 'm1-4': [1.8, -1.8, 0],   // Tier 2
        'm1-5': [-1.8, 0.3, 0], 'm1-6': [0, 0.6, 0.2], 'm1-7': [1.8, 0.3, 0],      // Tier 3
        'm1-8': [-1, 2, 0], 'm1-9': [1, 2, 0],                                     // Tier 4
        'm1-10': [0, 3.5, 0]            // Apex
    };

    const CONNECTIONS: Array<[string, string]> = [
        ['m1-1', 'm1-2'], ['m1-1', 'm1-3'], ['m1-1', 'm1-4'],
        ['m1-2', 'm1-3'], ['m1-3', 'm1-4'],
        ['m1-2', 'm1-5'], ['m1-3', 'm1-6'], ['m1-4', 'm1-7'],
        ['m1-5', 'm1-6'], ['m1-6', 'm1-7'],
        ['m1-5', 'm1-8'], ['m1-6', 'm1-8'], ['m1-6', 'm1-9'], ['m1-7', 'm1-9'],
        ['m1-8', 'm1-9'], ['m1-8', 'm1-10'], ['m1-9', 'm1-10'],
    ];

    const nodes = masterminds.map((mm, index) => ({
        id: mm.id,
        position: NODE_POSITIONS[mm.id] || [0, 0, 0],
        label: `Mondo ${index + 1}`,
        description: WORLD_THEMES[index % WORLD_THEMES.length]?.name || mm.title,
        isLocked: false, // TEMP: All unlocked for preview
        isActive: !completedModules.has(mm.id) && (index === 0 || completedModules.has(masterminds[index - 1].id)),
        isComplete: completedModules.has(mm.id)
    }));

    return (
        <div className="absolute inset-0 z-20">
            <Canvas
                dpr={[1, 2]}
                camera={{ position: [0, 0, 10], fov: 50 }}
                gl={{ antialias: true, alpha: true, toneMapping: 4, toneMappingExposure: 1.2 }}
            >
                <Suspense fallback={null}>
                    {/* 1. MYSTICAL ENVIRONMENT - Studio lighting for reflections */}
                    {/* Using a preset initially, but ideally this is a custom HDR */}
                    <Environment preset="city" blur={0.8} background={false} />

                    {/* 2. THE ARCANE MOON SOURCE - Cold, Silver-Blue Light */}
                    {/* Main Key Light (Moon) */}
                    <pointLight position={[5, 10, 5]} intensity={2} color="#e0f2fe" distance={30} decay={2} />

                    {/* Rim Light (Atmosphere) */}
                    <pointLight position={[-10, 0, 8]} intensity={1} color="#3b82f6" distance={25} decay={2} />

                    {/* Warm Fill from Below (Magma/Earth connection) */}
                    <pointLight position={[0, -10, 5]} intensity={0.5} color="#ea580c" distance={20} decay={2} />

                    {/* 3. ATMOSPHERIC PARTICLES - "Diamond Dust" */}
                    <Sparkles count={300} scale={[20, 20, 10]} size={0.8} speed={0.2} opacity={0.5} color="#ffffff" />
                    <Sparkles count={100} scale={[15, 15, 10]} size={1.5} speed={0.1} opacity={0.3} color="#fbbf24" />

                    {/* SCENE CONTENT */}
                    <group position={[0, -0.5, 0]}>
                        <ConstellationConnections
                            nodes={nodes}
                            connections={CONNECTIONS}
                            completedModules={completedModules}
                        />
                        {nodes.map((node, i) => (
                            <SephiraNode
                                key={node.id}
                                index={i}
                                {...node}
                                onClick={onSelectWorld}
                                playHoverSound={playHoverSound}
                                playClickSound={playClickSound}
                            />
                        ))}
                    </group>

                    {/* CAMERA MOVEMENT */}
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        enableRotate={false}
                    />

                    {/* CONTACT SHADOWS - Grounds the ethereal structure slightly */}
                    <ContactShadows position={[0, -7, 0]} opacity={0.4} scale={30} blur={2.5} far={10} />
                </Suspense>
            </Canvas>
        </div>
    );
};
