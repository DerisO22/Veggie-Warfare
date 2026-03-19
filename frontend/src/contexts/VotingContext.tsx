import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useSocket } from "./useSocket";

interface VotingContextType {
    hasVotingStarted: boolean;
    hasVotingEnded: boolean;
    votes: VotesType;
    mapWinner: string;
    handle_player_vote: (e: React.MouseEvent<HTMLDivElement>, choice: string) => void;
    votingTimeRemaining: number;
}

interface VotingContextProviderProps {
    children: ReactNode;
}

interface VotesType {
    map1: number;
    map2: number;
    map3: number;
}

export const Maps = {
    map1: "Valley",
    map2: "Volcano",
    map3: "Everest"
};

// Util function for mapping the map names to the server votes map fields
export const match_mapWinner_to_Name = (winner: keyof typeof Maps) => {
    return Maps[winner];
};

const VotingContext = createContext<VotingContextType | undefined>(undefined);

export const VotingContextProvider = ({ children }: VotingContextProviderProps) => {
    const { socket } = useSocket();
    const [hasVotingStarted, setHasVotingStarted] = useState(false);
    const [hasVotingEnded, setHasVotingEnded] = useState(false);
    const [votes, setVotes] = useState<VotesType>({
        map1: 0,
        map2: 0,
        map3: 0
    });
    const [mapWinner, setMapWinner] = useState<string>("");
    const [votingTimeRemaining, setVotingTimeRemaining] = useState<number>(0);
    const [playerVote, setPlayerVote] = useState<string | null>(null);
    const [isVoteLocked, setIsVoteLocked] = useState(false);

    // Handle the voting timer countdown
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

    // Handle all socket events
    useEffect(() => {
        if (!socket) return;

        socket.on("start_vote", (payload) => {
            console.log("Received start_vote event:", payload);
            
            const duration = payload.duration || 30000;
            const currentVotes = payload.current_votes || { map1: 0, map2: 0, map3: 0 };
            
            setHasVotingStarted(true);
            setHasVotingEnded(false);
            setVotingTimeRemaining(duration / 1000);
            setVotes(currentVotes);
            setPlayerVote(null);
            setIsVoteLocked(false);
        });

        socket.on("vote_update", (payload) => {
            console.log("Received vote_update event:", payload);
            
            const currentVotes = payload.current_votes || { map1: 0, map2: 0, map3: 0 };
            setVotes(currentVotes);
        });

        socket.on("end_vote", (payload) => {
            console.log("Received end_vote event:", payload);
            
            const winner = payload.winner || "";
            const finalVotes = payload.final_votes || { map1: 0, map2: 0, map3: 0 };
            
            setMapWinner(winner);
            setVotes(finalVotes);
            setHasVotingStarted(false);
            setHasVotingEnded(true);
            setIsVoteLocked(true);
        });

        // Cleanup listeners
        return () => {
            socket.off("start_vote");
            socket.off("vote_update");
            socket.off("end_vote");
        };
    }, [socket]);

    const handle_player_vote = (e: React.MouseEvent<HTMLDivElement>, choice: string) => {
        e.preventDefault();

        console.log(isVoteLocked)
        if (!socket || isVoteLocked || playerVote) {
            console.warn("Cannot vote at this time");
            return;
        }

        let mapKey = "map1";
        Object.entries(Maps).forEach(([key, value]) => {
            if (value === choice) {
                mapKey = key;
            }
        });

        setPlayerVote(mapKey);
        socket?.emit("player_vote", { choice: mapKey });
    };

    const voting_state = {
        hasVotingStarted,
        hasVotingEnded,
        votes,
        mapWinner,
        handle_player_vote,
        votingTimeRemaining,
    };

    return (
        <VotingContext.Provider value={voting_state}>
            {children}
        </VotingContext.Provider>
    );
};

export const useVoting = () => {
    const context = useContext(VotingContext);

    if (context === undefined) {
        throw new Error("useVoting must be used within a VotingContextProvider");
    }

    return context;
};