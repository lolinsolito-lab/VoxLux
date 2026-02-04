import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// 1.0s Singularity -> 2.0s Explosion -> 3.5s Warp
// OR warpOnly: Straight to Warp

export const BigBangWarp = ({ active, warpOnly = false }: { active: boolean, warpOnly?: boolean }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const { camera } = useThree();
    const count = 8000;
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Animation State
    const [phase, setPhase] = useState<'SINGULARITY' | 'EXPLOSION' | 'WARP'>(warpOnly ? 'WARP' : 'SINGULARITY');
    const timerRef = useRef(0);
    const particles = useMemo(() => {
        // ... (existing particle generation code is fine, omitted for brevity if unchanged, but since this is replace_file_content I must ensure context matches if I don't replace everything. I will replace the component body start)
        // actually, let's keep the particle generation as is, it's efficient.
        // I will replace the component start and the timeline logic.
        return new Array(8000).fill(0).map(() => {
            // Re-generating for stability in this snippet, although wasteful to re-write if I could snippet.
            // But for safety within replace_file_content block:
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const dirX = Math.sin(phi) * Math.cos(theta);
            const dirY = Math.sin(phi) * Math.sin(theta);
            const dirZ = Math.cos(phi);
            const tunnelRadius = 5 + Math.random() * 40;
            const tunnelAngle = Math.random() * Math.PI * 2;
            const tunnelX = Math.cos(tunnelAngle) * tunnelRadius;
            const tunnelY = Math.sin(tunnelAngle) * tunnelRadius;
            const speed = 0.5 + Math.random() * 2.5;
            const rnd = Math.random();
            const color = rnd > 0.5 ? '#fbbf24' : (rnd > 0.2 ? '#fde68a' : '#ffffff');
            return { x: 0, y: 0, z: 0, dirX, dirY, dirZ, tunnelX, tunnelY, speed, color, size: Math.random() };
        });
    }, []);

    const shakeRef = useRef(0);

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        timerRef.current += delta;

        // --- COMPRESSED TIMELINE (3.5s Total) ---
        if (active) {
            if (warpOnly) {
                if (phase !== 'WARP') setPhase('WARP');
            } else {
                if (timerRef.current < 1.0) {
                    if (phase !== 'SINGULARITY') setPhase('SINGULARITY');
                } else if (timerRef.current >= 1.0 && timerRef.current < 2.0) {
                    if (phase !== 'EXPLOSION') setPhase('EXPLOSION');
                } else if (timerRef.current >= 2.0) {
                    if (phase !== 'WARP') setPhase('WARP');
                }
            }
        }

        // --- VISUAL LOGIC ---

        const isSingularity = phase === 'SINGULARITY';
        const isExplosive = phase === 'EXPLOSION';
        const isWarping = phase === 'WARP';

        // 1. SINGULARITY CORE GLOW
        if (glowRef.current) {
            if (isSingularity) {
                // Instability vibration
                const shake = Math.sin(state.clock.elapsedTime * 60) * 0.05;
                glowRef.current.position.set(shake, shake, 0);

                // Implosion Pulse (shrinking before bang)
                const pulse = 1 - (timerRef.current / 1.5) * 0.5; // Shrink to 0.5
                glowRef.current.scale.setScalar(pulse);
                glowRef.current.visible = true;
            } else if (isExplosive) {
                // FLASH!
                glowRef.current.scale.setScalar(40); // Massive flash
                glowRef.current.material.opacity = THREE.MathUtils.lerp(glowRef.current.material.opacity, 0, delta * 8);
            } else {
                glowRef.current.visible = false;
            }
        }

        // 2. CAMERA MOVEMENTS (The "3D Feel")
        if (camera instanceof THREE.PerspectiveCamera) {
            let targetFov = 75;

            if (isExplosive) {
                // Shockwave shake
                shakeRef.current = 1.5 * (1 - (timerRef.current - 1.5) / 2.5); // Fade out shake
                targetFov = 110; // Wide angle for explosion scale
            } else if (isWarping) {
                shakeRef.current = 0.5;
                targetFov = 140; // Hyper speed
            } else {
                shakeRef.current = 0.05; // Subtle tension
            }

            // Apply Shake
            camera.position.x = (Math.random() - 0.5) * shakeRef.current;
            camera.position.y = (Math.random() - 0.5) * shakeRef.current;
            camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 2);
            camera.updateProjectionMatrix();
        }

        // 3. PARTICLE SIMULATION
        particles.forEach((p, i) => {
            const timeSinceBang = Math.max(0, timerRef.current - 1.5);

            if (isSingularity) {
                // Tightly packed in center
                p.x = (Math.random() - 0.5) * 0.1;
                p.y = (Math.random() - 0.5) * 0.1;
                p.z = (Math.random() - 0.5) * 0.1;
                dummy.scale.setScalar(0);
            }
            else if (isExplosive) {
                // EXPLOSION PHYSICS (Inverse Square + Drag)
                // Particles explode outwards in sphere
                const blastRadius = 80 * timeSinceBang * p.speed;

                p.x = p.dirX * blastRadius;
                p.y = p.dirY * blastRadius;
                p.z = p.dirZ * blastRadius;

                // Scale up then down
                const life = timeSinceBang / 2.5; // 0 to 1
                const scale = Math.sin(life * Math.PI) * p.size * 0.5;
                dummy.scale.setScalar(scale);
            }
            else if (isWarping) {
                // MORPH TO TUNNEL
                const warpTime = timerRef.current - 4.0;

                // Lerp current XYZ to Tunnel XYZ
                // We fake the transition by keeping Z moving fast, but collapsing X/Y to cylinder

                const collapseSpeed = 2.0;
                p.x = THREE.MathUtils.lerp(p.x, p.tunnelX, delta * collapseSpeed);
                p.y = THREE.MathUtils.lerp(p.y, p.tunnelY, delta * collapseSpeed);

                // Hyper Z Speed
                p.z += delta * 400 * p.speed;
                if (p.z > 50) p.z = -500; // Loop seamlessly

                // Stretch effect (Cylindrical scale)
                dummy.scale.set(0.1, 0.1, 8.0); // Long streaks
            }

            dummy.position.set(p.x, p.y, p.z);

            // Rotation for non-spheres (cubes look better rotating)
            if (isExplosive) {
                dummy.rotation.x += delta;
                dummy.rotation.y += delta;
            } else {
                dummy.rotation.set(0, 0, 0);
            }

            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    if (!active && timerRef.current > 8) return null;

    return (
        <group>
            {/* The Singularity Light Source */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[0.2, 32, 32]} />
                <meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={1} />
                <pointLight distance={50} decay={2} intensity={10} color="#fbbf24" />
            </mesh>

            {/* Volumetric Dust (Using Sparkles for cheap volume) */}
            {phase === 'EXPLOSION' && (
                <Sparkles count={500} scale={40} size={10} speed={4} opacity={0.5} color="#fbbf24" />
            )}

            {/* Main Debris Field */}
            <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
                {/* Sphere geometry for realistic debris, not boxes */}
                <sphereGeometry args={[0.3, 8, 8]} />
                <meshStandardMaterial
                    emissive="#fbbf24"
                    emissiveIntensity={2}
                    toneMapped={false}
                    color="#ffffff"
                />
            </instancedMesh>
        </group>
    );
};
