import { memo, type Dispatch, type SetStateAction } from "react";
import { useGameState } from "../../contexts/useGameState";
import { useSocket } from "../../contexts/useSocket";
import '../../styles/interface.css';

interface StatsInterfaceProps {
    cam: { 
        cameraMode: 'follow' | 'orbit',
        setCameraMode: Dispatch<SetStateAction<"follow" | "orbit">>
    },
}

const StatsInterface = ({ cam } : StatsInterfaceProps) => {
    const socket = useSocket();
    const gameState = useGameState();

    // Find local player
    const localPlayer = gameState.players.find(player => player.id === socket?.id);
    const localPlayerPosition = localPlayer?.position || null;

    return (
        <div className="game_info_container">
            <h3 style={{ margin: '0 0 10px 0' }}>Game Info</h3>
            <div>Players: {gameState.players.length}</div>
            <div>Connection: {socket?.connected ? '🟢 Connected' : '🔴 Disconnected'}</div>
            {socket?.id && <div>Your ID: {socket.id.substring(0, 8)}...</div>}
            
            <hr style={{ margin: '10px 0' }} />
            
            <div style={{ marginBottom: '5px' }}><strong>Controls:</strong></div>
            <div>• WASD - Move</div>
            <div>• Mouse - Rotate camera</div>
            
            <button 
                onClick={(e) => {
                    e.preventDefault();
                    cam.setCameraMode(mode => mode === 'follow' ? 'orbit' : 'follow');
                }}
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
                Camera: {cam.cameraMode === 'follow' ? 'Follow' : 'Orbit'}
            </button>
            
            {localPlayerPosition && (
                <div style={{ marginTop: '10px', fontSize: '0.9em', opacity: 0.7 }}>
                    Position: ({localPlayerPosition.x.toFixed(1)}, {localPlayerPosition.y.toFixed(1)}, {localPlayerPosition.z.toFixed(1)})
                </div>
            )}
        </div>
    );
}

export default memo(StatsInterface);