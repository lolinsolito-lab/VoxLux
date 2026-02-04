import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, AdditiveBlending, ShaderMaterial, DoubleSide } from 'three';
import * as THREE from 'three';

// --- HYPER TUNNEL SHADER ---
const TunnelShaderMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uColorStart: { value: new Color('#22d3ee') }, // Cyan
        uColorEnd: { value: new Color('#8b5cf6') },   // Violet
    },
    vertexShader: `
    varying vec2 vUv;
    varying float vDepth;
    uniform float uTime;
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Twist effect
      float angle = pos.z * 0.1 + uTime * 0.5;
      float x = pos.x * cos(angle) - pos.y * sin(angle);
      float y = pos.x * sin(angle) + pos.y * cos(angle);
      pos.x = x;
      pos.y = y;

      // Audio wave distortion pulse
      float wave = sin(pos.z * 0.2 + uTime * 5.0) * 0.5;
      pos.x += wave * smoothstep(0.0, 10.0, abs(pos.z)); // More distortion further away

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      vDepth = gl_Position.z;
    }
  `,
    fragmentShader: `
    varying vec2 vUv;
    varying float vDepth;
    uniform float uTime;
    uniform vec3 uColorStart;
    uniform vec3 uColorEnd;

    void main() {
      // Moving grid pattern
      float gridX = step(0.9, fract(vUv.x * 20.0 + sin(uTime)));
      float gridY = step(0.9, fract(vUv.y * 5.0 - uTime * 2.0));
      
      float strength = gridX + gridY;
      
      // Color gradient based on depth
      vec3 color = mix(uColorStart, uColorEnd, vUv.y);
      
      // Fade out at ends
      float alpha = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
      
      // Glow
      vec3 finalColor = color * strength * 2.0;

      gl_FragColor = vec4(finalColor, alpha * strength);
    }
  `
};

export const HyperTunnel = ({ active }: { active: boolean }) => {
    const tunnelRef = useRef<THREE.Mesh>(null);
    const particlesRef = useRef<THREE.Points>(null);

    // Shader Material Instance
    const shaderMat = useMemo(() => new ShaderMaterial({
        ...TunnelShaderMaterial,
        transparent: true,
        side: DoubleSide,
        blending: AdditiveBlending,
        depthWrite: false,
    }), []);

    useFrame((state) => {
        if (!active) return;
        const time = state.clock.elapsedTime;

        if (tunnelRef.current) {
            // Spin tunnel
            tunnelRef.current.rotation.z = time * 0.2;
            (tunnelRef.current.material as ShaderMaterial).uniforms.uTime.value = time;
        }

        if (particlesRef.current) {
            particlesRef.current.rotation.z = -time * 0.1;
            particlesRef.current.position.z = (time * 20) % 100 - 50;
        }
    });

    if (!active) return null;

    return (
        <group>
            {/* THE MAIN TUNNEL */}
            <mesh ref={tunnelRef} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[5, 1, 60, 32, 20, true]} />
                <primitive object={shaderMat} attach="material" />
            </mesh>

            {/* SPEED PARTICLES */}
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={500}
                        array={new Float32Array([...Array(500 * 3)].map(() => (Math.random() - 0.5) * 40))}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.1}
                    color="#ffffff"
                    transparent
                    opacity={0.8}
                    blending={AdditiveBlending}
                />
            </points>

            {/* CORE GLOW AT END */}
            <mesh position={[0, 0, -30]}>
                <sphereGeometry args={[2, 32, 32]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.5} blending={AdditiveBlending} />
            </mesh>
        </group>
    );
};
