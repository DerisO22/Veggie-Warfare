import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSocket } from "./useSocket";
import { useGameState } from "./useGameState";
import { useCurrentGameState } from "./CurrentGameState";

interface TeamMember {
    socketId: string;
    nickname: string;
    kills: number;
    deaths: number;
    character: string;
}

export interface TeamContextType {
    redTeam: TeamMember[];
    blueTeam: TeamMember[];
    redScore: number;
    blueScore: number;
    localPlayerTeam: "red" | "blue" | null;
}

interface TeamProviderProps {
    children: ReactNode;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider = ({ children }: TeamProviderProps) => {
    const { socket } = useSocket();
    const gameState = useGameState();
    const currentGameState = useCurrentGameState();
    
    const [redTeam, setRedTeam] = useState<TeamMember[]>([]);
    const [blueTeam, setBlueTeam] = useState<TeamMember[]>([]);
    const [redScore, setRedScore] = useState(0);
    const [blueScore, setBlueScore] = useState(0);
    const [isFrozen, setIsFrozen] = useState<boolean>(false);

    // Update teams whenever gameState changes
    useEffect(() => {
        if (!gameState.teamInfo) return;

        if(currentGameState === "ENDED" && isFrozen) {
            return;
        }

        setRedTeam(gameState.teamInfo.red);
        setBlueTeam(gameState.teamInfo.blue);
        setRedScore(gameState.teamInfo.teamScores.red);
        setBlueScore(gameState.teamInfo.teamScores.blue);
    }, [gameState.teamInfo?.red, gameState.teamInfo?.blue, gameState.teamInfo?.teamScores, currentGameState, isFrozen]);

    useEffect(() => {
        if (currentGameState === "ENDED") {
            setIsFrozen(true);
        }
    }, [currentGameState]);

    // Get local player's team
    const localPlayerTeam = gameState.players.find(
        p => p.id === socket?.id
    )?.team as "red" | "blue" | null || null;

    const value: TeamContextType = useMemo(() => ({
        redTeam,
        blueTeam,
        redScore,
        blueScore,
        localPlayerTeam
    }), [redTeam, blueTeam, redScore, blueScore, localPlayerTeam]);

    return (
        <TeamContext.Provider value={value}>
            {children}
        </TeamContext.Provider>
    );
};

export const useTeam = () => {
    const context = useContext(TeamContext);

    if (context === undefined) {
        throw new Error("useTeam must be used within a TeamProvider");
    }

    return context;
};