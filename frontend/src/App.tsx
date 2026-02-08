import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Vector3 } from 'three';
import { useSocket } from './utils/custom_hooks/useSocket';
import { useKeyboardControls } from './utils/custom_hooks/useKeyboardControls';
import { useGameState } from './utils/custom_hooks/useGameState';
import { PlayerCube } from './components/player/PlayerCube';

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
    const gameState = useGameState(socket);
    useKeyboardControls(socket);
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

            {/* UI Overlay */}
            <div style={{
                position: 'absolute',
                top: 20,
                left: 20,
                color: 'white',
                fontFamily: 'monospace',
                background: 'rgba(0,0,0,0.7)',
                padding: '15px',
                borderRadius: '8px',
                minWidth: '200px'
            }}>
                <h3 style={{ margin: '0 0 10px 0' }}>Game Info</h3>
                <div>Players: {gameState.players.length}</div>
                <div>Connection: {socket?.connected ? '🟢 Connected' : '🔴 Disconnected'}</div>
                {socket?.id && <div>Your ID: {socket.id.substring(0, 8)}...</div>}
                
                <hr style={{ margin: '10px 0' }} />
                
                <div style={{ marginBottom: '5px' }}><strong>Controls:</strong></div>
                <div>• WASD - Move</div>
                <div>• Mouse - Rotate camera</div>
                
                <button 
                    onClick={() => setCameraMode(mode => mode === 'follow' ? 'orbit' : 'follow')}
                    style={{
                        marginTop: '10px',
                        padding: '8px 12px',
                        background: '#4080ff',
                        border: 'none',
                        borderRadius: '4px',
                        color: 'white',
                        cursor: 'pointer',
                        width: '100%'
                    }}
                >
                    Camera: {cameraMode === 'follow' ? '📹 Follow' : '🔄 Orbit'}
                </button>
                
                {localPlayerPosition && (
                    <div style={{ marginTop: '10px', fontSize: '0.9em', opacity: 0.7 }}>
                        Position: ({localPlayerPosition.x.toFixed(1)}, {localPlayerPosition.y.toFixed(1)}, {localPlayerPosition.z.toFixed(1)})
                    </div>
                )}
            </div>

            {/* Loading state */}
            {!socket?.connected && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    fontFamily: 'monospace',
                    background: 'rgba(0,0,0,0.8)',
                    padding: '30px',
                    borderRadius: '10px',
                    textAlign: 'center'
                }}>
                    <h2>Connecting to server...</h2>
                    <p>Make sure the backend is running on port 3001</p>
                </div>
            )}
        </div>
    );
}

export default App;