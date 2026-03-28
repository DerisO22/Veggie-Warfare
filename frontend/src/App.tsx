import { Canvas } from '@react-three/fiber';
import { useSocket } from './contexts/useSocket';
import { useKeyboardControls } from './utils/custom_hooks/useKeyboardControls';
import GameChat from './components/game_chat/GameChat';
import StatsInterface from './components/interface/StatsInterface';
import LoadingInterface from './components/interface/LoadingInterface';
import Scene from './components/scene/Scene';
import { useEffect, useState } from 'react';
import Lobby from './components/interface/GameLobby/Lobby';
import { Sky, Stars } from '@react-three/drei';
import { SKY_CONFIG } from './utils/consts/environment';
import Abilities from './components/interface/Abilities';
import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';

import './styles/login_screen.css';

function App() {
    const { socket, isConnected } = useSocket();
    useKeyboardControls();
    const [cameraMode, setCameraMode] = useState<'follow' | 'orbit'>('follow');

    useEffect(() => {
        console.log("isConnected: ", isConnected);
    }, [socket]);

    return (
        <>
            <SignedOut>
                <div className="login_screen_container">
                    <div className='background_filter'></div>

                    <div className='login_info'>
                        <div className="login_logo_container">
                            <img className="logo_image" src="../../../../public/game_logo.webp"></img>
                        </div>

                        <h2 className='notify'>Looks Like You're Not Signed In!</h2>

                        <div className="login_container">
                            <SignIn appearance={{ theme: dark }}/>    
                        </div>
                    </div>
                </div>
            </SignedOut>

            <SignedIn>
                <div style={{ width: '100vw', height: '100vh' }}>
                    <Canvas camera={{ position: [1000, 100, 100], fov: 75 }}>
                        {/* Lighting */}
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 5]} intensity={1} />
                        <pointLight castShadow={true} position={[0, 5, 0]} intensity={10.5} />

                        {/* Skybox */}
                        <Sky
                            distance={300}
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
                        </>
                    ) : (
                        <LoadingInterface />
                    )}
                </div>
            </SignedIn>
        </>
    );
}

export default App;