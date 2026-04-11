import type { GameState } from "../utils/types/player";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useSocket } from "./useSocket";

const GameContext = createContext<GameState | undefined>(undefined);

interface GameProviderProps {
    children: ReactNode,
}

export const GameProvider = ({ children }: GameProviderProps) => {
    const { socket } = useSocket();
    const [gameState, setGameState] = useState<GameState>({ 
        players: [],
        gameState: "WAITING",
        teamScores: { red: 0, blue: 0 },
        timeRemaining: 600000,
        timeRemainingSeconds: 600,
        teamInfo: {
            red: [],
            blue: [],
            teamScores: { red: 0, blue: 0 }
        }
    });

    useEffect(() => {
        if(!socket) return;

        const handleState = (state: GameState) => {
            console.log(state.teamInfo)
            setGameState(state);
        }

        socket.on('sendState', handleState);

        return () => {
            socket.off('sendState', handleState);
        }
    }, [socket]);

    return (
        <GameContext.Provider value={gameState}>
            {children}
        </GameContext.Provider>
    )
}

export const useGameState = () => {
    const context = useContext(GameContext);

    if(context === undefined) {
        throw new Error("useGameState cant be used outside of GameProvider");
    }

    return context;
}