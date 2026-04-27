import { useFrame } from '@react-three/fiber';
import { forwardRef, useRef } from 'react';
import { Group, Vector3, MathUtils } from 'three';
import Character from './Character';
import { Center, Text3D } from '@react-three/drei';

interface PlayerProps {
    position: { x: number; y: number; z: number };
    rotation?: number; 
    characterType: string,
    localPlayerNickname: string,
    localPlayerTeam: 'red' | 'blue'
}

export const PlayerCube = forwardRef<Group, PlayerProps>((
    { position, rotation, characterType = "carrot", localPlayerNickname, localPlayerTeam }, 
    ref
) => {
    const internalRef = useRef<Group>(null);
    const lerpTarget = useRef(new Vector3());
    const rotationTarget = useRef(0);
    const currentRotation = useRef(0);

    const groupRef = (ref && 'current' in ref ? ref : internalRef) as React.RefObject<Group>;

    useFrame((_) => {
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

            <group position={[.2, 4.5, 0]}>
                <Center top>
                    <Text3D
                        curveSegments={32}
                        bevelEnabled
                        bevelSize={0.001}
                        bevelThickness={0.00002}
                        height={0.5}
                        lineHeight={0.5}
                        letterSpacing={0.06}
                        size={.2}
                        rotation={[0, Math.PI, 0]}
                        font={"/Inter_Bold.json"}
                    >
                        {localPlayerNickname}
                        <meshStandardMaterial 
                            color={localPlayerTeam === 'red' ? '#ff4757' : '#2e86de'} 
                            emissive={localPlayerTeam === 'red' ? '#ff4757' : '#2e86de'}
                            emissiveIntensity={0.8}
                        />
                    </Text3D>
                </Center>
            </group>
        </group>
    );
});

PlayerCube.displayName = 'PlayerCube';