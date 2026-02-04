import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// CINEMATIC HYPERSPACE JUMP
// High-performance InstancedMesh implementation with 5000+ particles
export const FusedWarp = ({ active }: { active: boolean }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const { camera } = useThree();
    const count = 5000;
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Stable random data for particles
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 10 + Math.random() * 200; // Wide tunnel
            const z = Math.random() * -1000;         // Deep initial spread
            const speed = 2 + Math.random() * 3;     // Base variation
            // "White Gold Champagne" Palette: 40% Violet, 30% Champagne, 30% White
            const color = Math.random() > 0.6 ? '#a78bfa' : (Math.random() > 0.5 ? '#f3e5ab' : '#ffffff');
            temp.push({ angle, radius, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z, speed, color });
        }
        return temp;
    }, []);

    // Initial positioning and coloring
    useEffect(() => {
        if (meshRef.current) {
            particles.forEach((p, i) => {
                dummy.position.set(p.x, p.y, p.z);
                dummy.updateMatrix();
                meshRef.current!.setMatrixAt(i, dummy.matrix);
                meshRef.current!.setColorAt(i, new THREE.Color(p.color));
            });
            meshRef.current.instanceMatrix.needsUpdate = true;
            meshRef.current.instanceColor!.needsUpdate = true;
        }
    }, [dummy, particles]);

    // Speed Control
    const currentSpeedRef = useRef(0);
    const shakeIntensityRef = useRef(0);
    const initialFovRef = useRef(75); // Store FOV to reset

    useEffect(() => {
        if (camera instanceof THREE.PerspectiveCamera) {
            initialFovRef.current = camera.fov;
        }
    }, [camera]);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // ACCELERATION LOGIC
        const targetSpeed = active ? 400 : 0; // Huge speed
        currentSpeedRef.current = THREE.MathUtils.lerp(currentSpeedRef.current, targetSpeed, delta * 2);

        // TUNNEL VISION (FOV DISTORTION)
        if (camera instanceof THREE.PerspectiveCamera) {
            const targetFov = active ? 120 : initialFovRef.current;
            camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 2);
            camera.updateProjectionMatrix();
        }

        // CAMERA SHAKE (Vibration at high speed)
        if (active && currentSpeedRef.current > 100) {
            shakeIntensityRef.current = THREE.MathUtils.lerp(shakeIntensityRef.current, 0.5, delta * 5);
            camera.position.x = (Math.random() - 0.5) * shakeIntensityRef.current;
            camera.position.y = (Math.random() - 0.5) * shakeIntensityRef.current;
        } else {
            shakeIntensityRef.current = 0;
            camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, delta * 5);
            camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, delta * 5);
        }

        // PARTICLE LOOP
        particles.forEach((p, i) => {
            // Move huge distance based on speed
            p.z += delta * (p.speed * currentSpeedRef.current);

            // Infinite Tunnel Loop
            if (p.z > 50) { // If it passes camera
                p.z = -1000; // Send back to deep space
            }

            // Update Instance
            dummy.position.set(p.x, p.y, p.z);

            // STRETCH EFFECT (Speed Lines)
            // Scale Z based on speed to look like light streaks
            const stretch = 1 + (currentSpeedRef.current * 0.5);
            dummy.scale.set(0.5, 0.5, stretch);

            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    if (!active && currentSpeedRef.current < 1) return null;

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <boxGeometry args={[0.5, 0.5, 1]} />
            <meshBasicMaterial transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </instancedMesh>
    );
};
