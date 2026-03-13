import { Canvas } from '@react-three/fiber';
import { useSocket } from './contexts/useSocket';
import { useKeyboardControls } from './utils/custom_hooks/useKeyboardControls';
import GameChat from './components/game_chat/GameChat';
import StatsInterface from './components/interface/StatsInterface';
import LoadingInterface from './components/interface/LoadingInterface';
import Scene from './components/scene/Scene';
import { useEffect, useState } from 'react';
import Lobby from './components/interface/GameLobby/Lobby';

function App() {
    const { socket, isConnected } = useSocket();
    useKeyboardControls();
    const [cameraMode, setCameraMode] = useState<'follow' | 'orbit'>('follow');

    useEffect(() => {
        console.log("isConnected: ", isConnected);
    }, [socket]);

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Canvas camera={{ position: [1000, 100, 100], fov: 75 }}>
                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight castShadow={true} position={[0, 5, 0]} intensity={10.5} />

                {/* Environment */}
                {/* <gridHelper args={[50, 50]} /> */}
                <Scene cameraMode={cameraMode} />
                
                {/* Ground plane */}
                {/* <mesh receiveShadow={true} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
                    <planeGeometry args={[100, 100]} />
                    <meshStandardMaterial color="white" />
                </mesh> */}
            </Canvas>

            {/* Interface */}
            <Lobby />
            
            {/* Game Chat */}
            {isConnected ? (
                <>
                    <StatsInterface cam={{cameraMode, setCameraMode}}/>
                    <GameChat />
                </>
            ): (
                <LoadingInterface />
            )}
        </div>
    );
}

export default App;