import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Vector3 } from 'three';
import { useSocket } from './contexts/useSocket';
import { useKeyboardControls } from './utils/custom_hooks/useKeyboardControls';
import { useGameState } from './contexts/useGameState';
import { PlayerCube } from './components/player/PlayerCube';
import GameChat from './components/game_chat/GameChat';
import StatesInterface from './components/interface/StatsInterface';
import LoadingInterface from './components/interface/LoadingInterface';

// Camera follower component
function CameraFollower({ targetPosition }: { targetPosition: { x: number; y: number; z: number } | null }) {
    const { camera } = useThree();
    const targetRef = useRef(new Vector3());

    useFrame(() => {
        if (targetPosition) {
            targetRef.current.set(
                targetPosition.x,
                targetPosition.y + 5,
                targetPosition.z + 10
            );
            camera.position.lerp(targetRef.current, 0.1);
            camera.lookAt(targetPosition.x, targetPosition.y, targetPosition.z);
        }
    });

    return null;
}

function App() {
    const socket = useSocket();
    const gameState = useGameState();
    useKeyboardControls();
    const [cameraMode, setCameraMode] = useState<'follow' | 'orbit'>('follow');

    // Find local player
    const localPlayer = gameState.players.find(player => player.id === socket?.id);
    const localPlayerPosition = localPlayer?.position || null;

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Canvas camera={{ position: [10, 10, 10], fov: 75 }}>
                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[0, 5, 0]} intensity={0.5} />

                {/* Environment */}
                <gridHelper args={[50, 50]} />
                
                {/* Ground plane */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
                    <planeGeometry args={[100, 100]} />
                    <meshStandardMaterial color="#1a1a1a" />
                </mesh>

                {/* Render all players */}
                {gameState.players.map((player) => (
                    <PlayerCube
                        key={player.id}
                        position={player.position}
                        isLocalPlayer={player.id === socket?.id}
                    />
                ))}

                {/* Camera controls */}
                {cameraMode === 'follow' && localPlayerPosition ? (
                    <CameraFollower targetPosition={localPlayerPosition} />
                ) : (
                    <OrbitControls />
                )}
            </Canvas>

            <StatesInterface cam={{cameraMode, setCameraMode}} localPlayerPosition={localPlayerPosition}/>
            <LoadingInterface />

            {/* Game Chat */}
            {/* {socket?.connected && ( */}
            <GameChat />
            {/* )} */}
        </div>
    );
}

export default App;