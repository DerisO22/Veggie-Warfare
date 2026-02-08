import type { Socket } from "socket.io-client";
import type { GameState } from "../types/player";
import { useEffect, useState } from "react";

export const useGameState = (socket: Socket | null) => {
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
    }, [socket])

    return gameState;
}