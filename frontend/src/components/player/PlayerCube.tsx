import { useFrame } from '@react-three/fiber';
import { forwardRef, useRef } from 'react';
import { Mesh, Vector3, MathUtils } from 'three';

interface PlayerProps {
    position: { x: number; y: number; z: number };
    rotation?: number; 
    isLocalPlayer?: boolean;
    team?: 'red' | 'blue';
    isDead?: boolean;
}

export const PlayerCube = forwardRef<Mesh, PlayerProps>((
    { position, rotation, isLocalPlayer = false, team = 'red', isDead = false }, 
    ref
) => {
        const internalRef = useRef<Mesh>(null);
        const lerpTarget = useRef(new Vector3());
        const rotationTarget = useRef(0);
        const currentRotation = useRef(0);

        const meshRef = (ref && 'current' in ref ? ref : internalRef) as React.RefObject<Mesh>;

        useFrame((_, delta) => {
            if (meshRef.current) {
                lerpTarget.current.set(position.x, position.y, position.z);
                meshRef.current.position.lerp(lerpTarget.current, 0.2);

                rotationTarget.current = rotation ?? 0;
                currentRotation.current = MathUtils.lerp(
                    currentRotation.current,
                    rotationTarget.current,
                    0.1
                );
                meshRef.current.rotation.y = currentRotation.current;
            
            }
        });

        const getPlayerColor = () => {
            if (isDead) return '#444444';
            if (isLocalPlayer) return '#ffff00'; 
            
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