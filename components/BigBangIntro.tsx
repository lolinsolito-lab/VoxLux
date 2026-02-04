import React, { useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Stars } from '@react-three/drei';
import { BigBangWarp } from './BigBangWarp';
import { useAudioSystem } from '../hooks/useAudioSystem';

// Self-contained Intro Component
// Renders the Big Bang Sequence in its own Canvas
// Returns onComplete when finished

interface BigBangIntroProps {
    onComplete: () => void;
    type?: 'BIG_BANG' | 'WARP';
}

export const BigBangIntro: React.FC<BigBangIntroProps> = ({ onComplete, type = 'BIG_BANG' }) => {
    const { playSound } = useAudioSystem();

    useEffect(() => {
        // Play Intro Sound
        playSound('warp');

        // Timing: 3.5s total duration as requested
        const timer = setTimeout(() => {
            onComplete();
        }, 3500);

        return () => clearTimeout(timer);
    }, [onComplete, playSound]);

    return (
        <div className="fixed inset-0 z-[100] bg-black">
            <Canvas dpr={[1, 2]}>
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={75} />
                    <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade />

                    {/* The Big Bang Effect */}
                    <BigBangWarp active={true} warpOnly={type === 'WARP'} />

                    <ambientLight intensity={0.1} />
                </Suspense>
            </Canvas>
        </div>
    );
};
