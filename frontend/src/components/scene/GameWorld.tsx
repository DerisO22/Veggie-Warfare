import { useGameState } from "../../contexts/useGameState"
import { useSocket } from "../../contexts/useSocket";
import { PlayerCube } from "../player/PlayerCube";
import { useRef } from "react";
import { Group } from "three";
import { CameraFollower } from "../player/CameraFollower";
import { OrbitControls } from "@react-three/drei";

interface GameWorldProps {
    cameraMode: 'follow' | 'orbit',
}

const GameWorld = ({ cameraMode } : GameWorldProps) => {
    const gameState = useGameState();
    const { socket } = useSocket();
    const localPlayerRef = useRef<Group>(null);

    // Find local player
    const localPlayer = gameState.players.find(player => player.id === socket?.id);
    // const localPlayerPosition = localPlayer?.position || null;

    return (
        <>
            {/* Render all players */}
            {gameState.players.map((player) => (
                <PlayerCube
                    ref={player.id === socket?.id ? localPlayerRef : null}
                    key={player.id}
                    rotation={player.rotation}
                    position={player.position}
                    characterType={player.character}
                    localPlayerNickname={player.nickname ?? "Player"}
                    localPlayerTeam={player.team ?? "blue"}
                />
            ))}

            {/* Camera controls */}
            {cameraMode === 'follow' ? (
                <CameraFollower targetRef={localPlayerRef} rotationY={localPlayer?.rotation} />
            ) : <OrbitControls />}
        </>
    )
}

export default GameWorld;