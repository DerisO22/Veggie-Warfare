import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { useSocket } from "./useSocket";
import type { VotingContextType, VotingContextProviderProps, VotesType } from "../utils/types/lobbyTypes";

export const Maps = {
    map1: "Valley",
    map2: "Volcano",
    map3: "Everest"
};

export const match_mapWinner_to_Name = (winner: keyof typeof Maps) => {
    return Maps[winner];
};

const VotingContext = createContext<VotingContextType | undefined>(undefined);
const VotingTimerContext = createContext<number>(0);

export const VotingContextProvider = ({ children }: VotingContextProviderProps) => {
    const { socket } = useSocket();
    const [hasVotingStarted, setHasVotingStarted] = useState(false);
    const [hasVotingEnded, setHasVotingEnded] = useState(false);
    const [votes, setVotes] = useState<VotesType>({ map1: 0, map2: 0, map3: 0 });
    const [mapWinner, setMapWinner] = useState<string>("");
    const [votingTimeRemaining, setVotingTimeRemaining] = useState<number>(0);
    const [playerVote, setPlayerVote] = useState<string | null>(null);
    const [isVoteLocked, setIsVoteLocked] = useState(false);
    const [isVotingVisible, setIsVotingVisible] = useState<boolean>(false);

    // Timer
    useEffect(() => {
        if (!hasVotingStarted || hasVotingEnded) return;

        const interval = setInterval(() => {
            setVotingTimeRemaining((prev) => {
                if (prev <= 0.1) {
                    clearInterval(interval);
                    return 0;
                }
                return Math.max(prev - 0.1, 0);
            });
        }, 100);

        return () => clearInterval(interval);
    }, [hasVotingStarted, hasVotingEnded]);

    useEffect(() => {
        if (!socket) return;

        socket.on("start_vote", (payload) => {
            const duration = payload.duration || 30000;
            const currentVotes = payload.current_votes || { map1: 0, map2: 0, map3: 0 };
            
            setIsVotingVisible(true);
            setHasVotingStarted(true);
            setHasVotingEnded(false);
            setVotingTimeRemaining(duration / 1000);
            setVotes(currentVotes);
            setPlayerVote(null);
            setIsVoteLocked(false);
        });

        socket.on("vote_update", (payload) => {
            const currentVotes = payload.current_votes || { map1: 0, map2: 0, map3: 0 };
            setVotes(currentVotes);
        });

        socket.on("end_vote", (payload) => {
            const winner = payload.winner || "";
            const finalVotes = payload.final_votes || { map1: 0, map2: 0, map3: 0 };
            
            setMapWinner(winner);
            setVotes(finalVotes);
            setHasVotingStarted(false);
            setHasVotingEnded(true);
            setIsVoteLocked(true);
            setIsVotingVisible(false);
        });

        return () => {
            socket.off("start_vote");
            socket.off("vote_update");
            socket.off("end_vote");
        };
    }, [socket]);

    const toggleVotingVisibility = useCallback(() => {
        setIsVotingVisible(prev => !prev);
    }, []);

    const handle_player_vote = useCallback((e: React.MouseEvent<HTMLDivElement>, choice: string) => {
        e.preventDefault();

        if (!socket || isVoteLocked || playerVote) {
            console.warn("Cannot vote at this time");
            return;
        }

        let mapKey = "map1";
        Object.entries(Maps).forEach(([key, value]) => {
            if (value === choice) mapKey = key;
        });

        setPlayerVote(mapKey);
        socket.emit("player_vote", { choice: mapKey });
    }, [socket, isVoteLocked, playerVote]);

    const voting_state = useMemo(() => ({
        hasVotingStarted,
        hasVotingEnded,
        votes,
        mapWinner,
        handle_player_vote,
        isVotingVisible,
        toggleVotingVisibility
    }), [ hasVotingStarted, hasVotingEnded, votes, mapWinner, handle_player_vote, isVotingVisible, toggleVotingVisibility ]);

    return (
        <VotingContext.Provider value={voting_state}>
            <VotingTimerContext.Provider value={votingTimeRemaining}>
                {children}
            </VotingTimerContext.Provider>
        </VotingContext.Provider>
    );
};

export const useVoting = () => {
    const context = useContext(VotingContext);

    if (context === undefined) {
        throw new Error("useVoting must be used within VotingContextProvider");
    }

    return context;
};

export const useVotingTimer = () => {
    const context = useContext(VotingTimerContext);
    return context;
};