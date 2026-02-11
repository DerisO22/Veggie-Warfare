import type { GameState } from "../types/player";
import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";

export const useGameState = () => {
    const socket = useSocket();
    const [gameState, setGameState] = useState<GameState>({ players: [] });

    useEffect(() => {
        if(!socket) return;

        const handleState = (state: GameState) => {
            setGameState(state);
        }

        socket.on('sendState', handleState);

        return () => {
            socket.off('sendState', handleState);
        }
    }, [socket]);

    return gameState;
}