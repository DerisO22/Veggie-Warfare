import { useFrame } from '@react-three/fiber';
import { forwardRef, useRef } from 'react';
import { Group, Vector3, MathUtils } from 'three';
import Character from './Character';

interface PlayerProps {
    position: { x: number; y: number; z: number };
    rotation?: number; 
    isLocalPlayer?: boolean;
    team?: 'red' | 'blue';
    isDead?: boolean;
    characterType: string
}

export const PlayerCube = forwardRef<Group, PlayerProps>((
    { position, rotation, isLocalPlayer = false, team = 'red', isDead = false, characterType = "carrot" }, 
    ref
) => {
    const internalRef = useRef<Group>(null);
    const lerpTarget = useRef(new Vector3());
    const rotationTarget = useRef(0);
    const currentRotation = useRef(0);

    const groupRef = (ref && 'current' in ref ? ref : internalRef) as React.RefObject<Group>;

    useFrame((_, delta) => {
        if (groupRef.current) {
            lerpTarget.current.set(position.x, position.y, position.z);
            groupRef.current.position.lerp(lerpTarget.current, 0.2);

            rotationTarget.current = rotation ?? 0;
            currentRotation.current = MathUtils.lerp(
                currentRotation.current,
                rotationTarget.current,
                0.1
            );
            groupRef.current.rotation.y = currentRotation.current;
        }
    });

    return (
        <group ref={groupRef}>
            <Character modelType={characterType} />
        </group>
    );
});

PlayerCube.displayName = 'PlayerCube';