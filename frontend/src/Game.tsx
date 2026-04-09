import LoadingInterface from './components/interface/LoadingInterface';
import GameChat from './components/game_chat/GameChat';
import StatsInterface from './components/interface/StatsInterface';
import Abilities from './components/interface/Abilities';
import Lobby from './components/interface/GameLobby/Lobby';
import Scene from './components/scene/Scene';
import { Canvas } from '@react-three/fiber';
import { Sky, Stars } from '@react-three/drei';
import { SKY_CONFIG } from './utils/consts/environment';
import { useEffect, useState } from 'react';
import { useSocket } from './contexts/useSocket';
import { useKeyboardControls } from './utils/custom_hooks/useKeyboardControls';

/**
 * Authentication Imports
 */
import { useUser } from '@clerk/clerk-react';
import { usePlayerData } from './contexts/PlayerContext';
import TeamScoreboard from './components/interface/TeamScoreboard';
import EndGame from './components/interface/EndGame';

const Game = () => {
    const { socket, isConnected } = useSocket();
    useKeyboardControls();
    const [cameraMode, setCameraMode] = useState<'follow' | 'orbit'>('follow');
    const { user } = useUser();
    const { get_player_data } = usePlayerData();

    useEffect(() => {
        if(!user?.id) return;

        get_player_data(user?.id);
    }, [user?.id]);

    useEffect(() => {
        console.log("isConnected: ", isConnected);
    }, [socket]);
    
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Canvas 
                camera={{ position: [1000, 100, 100], fov: 75 }} 
                shadows 
                gl={{ antialias: true, powerPreference: "default"}}
                dpr={[1, 2]}
            >
                {/* Skybox */}
                <Sky
                    distance={400}
                    sunPosition={[0, -1, 0]}
                    inclination={SKY_CONFIG.dark.inclination}
                    azimuth={SKY_CONFIG.dark.azimuth}
                    mieCoefficient={SKY_CONFIG.dark.mieCoefficient}
                    mieDirectionalG={SKY_CONFIG.dark.mieDirectionalG}
                    rayleigh={SKY_CONFIG.dark.rayleigh}
                    turbidity={SKY_CONFIG.dark.turbidity}
                />

                <Stars 
                    radius={1} 
                    depth={50} 
                    count={1000} 
                    factor={1.2} 
                    saturation={10} 
                    fade={true} 
                    speed={1}
                /> 

                {/* Environment */}
                <Scene cameraMode={cameraMode} />
            </Canvas>

            {/* Interface */}
            <Lobby />
            
            {/* Game Chat */}
            {isConnected ? (
                <>
                    <Abilities />
                    <StatsInterface cam={{cameraMode, setCameraMode}}/>
                    <GameChat />
                    <TeamScoreboard />
                    <EndGame />
                </>
            ) : (
                <LoadingInterface />
            )}
        </div>
    )
}

export default Game;