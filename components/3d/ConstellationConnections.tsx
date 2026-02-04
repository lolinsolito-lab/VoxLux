import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface ConnectionProps {
    start: [number, number, number];
    end: [number, number, number];
    isActive: boolean;
    index: number;
}

const GoldenConnection: React.FC<ConnectionProps> = ({ start, end, isActive, index }) => {
    const lineRef = useRef<any>(null);

    // CURVED PATH
    const points = useMemo(() => {
        const startVec = new THREE.Vector3(...start);
        const endVec = new THREE.Vector3(...end);
        const mid = new THREE.Vector3().lerpVectors(startVec, endVec, 0.5);
        // Slight curve
        mid.z += 0.3;

        const curve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec);
        return curve.getPoints(20);
    }, [start, end]);

    // GOLDEN ENERGY FLOW
    useFrame(() => {
        if (isActive && lineRef.current) {
            lineRef.current.material.dashOffset -= 0.015;
        }
    });

    // GOLDEN CRYSTAL COLORS
    const GOLD_CORE = "#fbbf24";
    const GOLD_GLOW = "#f59e0b";
    const DORMANT = "#2a2a20";

    return (
        <group>
            {/* MAIN LASER-GOLD BEAM */}
            <Line
                ref={lineRef}
                points={points}
                color={isActive ? GOLD_CORE : DORMANT}
                lineWidth={1} // Very thin laser
                transparent
                opacity={isActive ? 0.8 : 0.15}
                toneMapped={false} // Glows brightly
            />

            {/* GOLDEN GLOW */}
            {isActive && (
                <Line
                    points={points}
                    color={GOLD_GLOW}
                    lineWidth={5}
                    transparent
                    opacity={0.2}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            )}
        </group>
    );
};

interface ConstellationConnectionsProps {
    nodes: Array<{ id: string; position: [number, number, number]; isLocked: boolean }>;
    connections: Array<[string, string]>;
    completedModules: Set<string>;
}

export const ConstellationConnections: React.FC<ConstellationConnectionsProps> = ({
    nodes,
    connections,
    completedModules
}) => {
    const getNode = (id: string) => nodes.find(n => n.id === id);

    return (
        <group>
            {connections.map(([startId, endId], idx) => {
                const startNode = getNode(startId);
                const endNode = getNode(endId);

                if (!startNode || !endNode) return null;
                const isActive = !startNode.isLocked;

                return (
                    <GoldenConnection
                        key={`${startId}-${endId}`}
                        start={startNode.position}
                        end={endNode.position}
                        isActive={isActive}
                        index={idx}
                    />
                );
            })}
        </group>
    );
};
