import { useGameState } from "../../contexts/useGameState"
import { useSocket } from "../../contexts/useSocket";
import { PlayerCube } from "../player/PlayerCube";
import { useRef } from "react";
import { Mesh } from "three";
import { CameraFollower } from "../player/CameraFollower";

interface GameWorldProps {
    cameraMode: 'follow' | 'orbit',
}

const GameWorld = ({ cameraMode } : GameWorldProps) => {
    const gameState = useGameState();
    const { socket } = useSocket();
    const localPlayerRef = useRef<Mesh>(null!);

    // Find local player
    const localPlayer = gameState.players.find(player => player.id === socket?.id);
    const localPlayerPosition = localPlayer?.position || null;

    return (
        <>
            {/* Render all players */}
            {gameState.players.map((player) => (
                <PlayerCube
                    ref={player.id === socket?.id ? localPlayerRef : null}
                    key={player.id}
                    position={player.position}
                    isLocalPlayer={player.id === socket?.id}
                    team={player.team}
                    isDead={player.isDead}
                />
            ))}

            {/* Camera controls */}
            {cameraMode === 'follow' && localPlayerPosition && (
                <CameraFollower targetRef={localPlayerRef} />
            )}
        </>
    )
}

export default GameWorld