import { useRef } from 'react';
import { Mesh } from 'three';

interface PlayerProps {
    position: { x: number; y: number; z: number };
    isLocalPlayer?: boolean;
}

export const PlayerCube: React.FC<PlayerProps> = ({ position, isLocalPlayer = false }) => {
    const meshRef = useRef<Mesh>(null);

    return (
        <mesh ref={meshRef} position={[position.x, position.y, position.z]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={isLocalPlayer ? '#4080ff' : '#ff4040'} />
        </mesh>
    );
};