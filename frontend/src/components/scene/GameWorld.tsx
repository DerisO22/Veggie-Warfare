import { OrbitControls } from "@react-three/drei";
import { useGameState } from "../../contexts/useGameState"
import { useSocket } from "../../contexts/useSocket";
import { PlayerCube } from "../player/PlayerCube";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Vector3 } from "three";


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

const GameWorld = () => {
    const gameState = useGameState();
    const socket = useSocket();
    const [cameraMode, setCameraMode] = useState<'follow' | 'orbit'>('follow');

    // Find local player
    const localPlayer = gameState.players.find(player => player.id === socket?.id);
    const localPlayerPosition = localPlayer?.position || null;

    return (
        <>
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
        </>
    )
}

export default GameWorld
