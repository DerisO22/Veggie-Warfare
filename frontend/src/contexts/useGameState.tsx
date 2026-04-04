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

    const updateCurrentGameState = (current_game_state: "WAITING" | "VOTING" | "PLAYING" | "ENDED") => {
        setGameState(prev => ({
            ...prev,
            ["gameState"]: current_game_state
        }))
    }

    useEffect(() => {
        if(!socket) return;

        const handleState = (state: GameState) => {
            setGameState(state);
        }

        socket.on('sendState', handleState);
        socket.on('current_game_state', updateCurrentGameState);

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