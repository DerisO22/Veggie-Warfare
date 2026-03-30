import { useFrame } from '@react-three/fiber';
import { forwardRef, useRef } from 'react';
import { Mesh, Vector3 } from 'three';

interface PlayerProps {
    position: { x: number; y: number; z: number };
    isLocalPlayer?: boolean;
    team?: 'red' | 'blue';
    isDead?: boolean;
}

export const PlayerCube = forwardRef<Mesh, PlayerProps>(
    ({ position, isLocalPlayer = false, team = 'red', isDead = false }, ref) => {
        const internalRef = useRef<Mesh>(null);
        const lerpTarget = useRef(new Vector3());

        // Use the forwarded ref for local player, internal ref for remote players
        const meshRef = (ref && 'current' in ref ? ref : internalRef) as React.RefObject<Mesh>;

        useFrame((_, delta) => {
            if (meshRef.current) {
                lerpTarget.current.set(position.x, position.y, position.z);
                meshRef.current.position.lerp(lerpTarget.current, 0.2);
            }
        });

        // Determine color based on team and state
        const getPlayerColor = () => {
            if (isDead) return '#444444';
            if (isLocalPlayer) return '#ffff00'; 
            
            // Color by team
            switch (team) {
                case 'red':
                    return '#ff4444';
                case 'blue':
                    return '#4444ff';
                default:
                    return '#ffffff';
            }
        };

        const playerColor = getPlayerColor();

        return (
            <mesh ref={meshRef}>
                <capsuleGeometry args={[0.5, 1, 4, 8]} />
                <meshStandardMaterial 
                    color={playerColor}
                    emissive={isLocalPlayer ? 0xffff00 : undefined}
                    emissiveIntensity={isLocalPlayer ? 0.3 : 0}
                />
            </mesh>
        );
    }
);

PlayerCube.displayName = 'PlayerCube';