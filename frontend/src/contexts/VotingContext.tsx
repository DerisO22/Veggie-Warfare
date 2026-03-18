import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useSocket } from "./useSocket";

interface VotingContextType {
    isVotingActive: boolean;
    votes: VotesType,
    mapWinner: string,
    handle_player_vote: (e: React.MouseEvent<HTMLDivElement>, choice: string) => void
}

interface VotingContextProviderProps {
    children: ReactNode
}

interface VotesType {
    map1: number,
    map2: number,
    map3: number
}

export const Maps = {
    map1: "Valley",
    map2: "Volcano",
    map3: "Everest"
}

// util function for mapping the map names to the server votes map fields
export const match_mapWinner_to_Name = (winner: keyof typeof Maps) => {
    return Maps[winner];
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

export const VotingContextProvider = ({ children }: VotingContextProviderProps) => {
    const { socket } = useSocket();
    const [ isVotingActive, isSetVotingActive ] = useState<boolean>(false);
    const [ votes, setVotes ] = useState<VotesType>({
        map1: 0,
        map2: 0,
        map3: 0
    });
    const [ mapWinner, setMapWinner ] = useState<string>("");
    const [ votingTime, setVotingTime ] = useState<number>(0);

    // handling all the different socket event emits and what nots
    useEffect(() => {
        if(!socket) return;

        socket.on("start_vote", ({ duration, serverTime, votes }) => {
            setVotingTime(duration);
            setVotes((prev) => ({...prev, ...votes}));
            isSetVotingActive(true);
        });

        socket.on("end_vote", ({ winner, finalVotes }) => {

            setMapWinner(winner);
            setVotes((prev) => ({...prev, ...finalVotes}));
            isSetVotingActive(false);
        });

        socket.on("update_vote", ({ votes }) => {
            setVotes((prev) => ({
                ...prev,
                ...votes
            }))
        });

        return () => {
            socket.off("start_vote");
            socket.off("end_vote");
            socket.off("update_vote");
        }
    }, []);

    const handle_player_vote = (e: React.MouseEvent<HTMLDivElement>, choice: string) => {
        e.preventDefault();
        if(!socket) return;

        socket?.emit("player_vote", { choice });
    }

    const voting_state = {
        isVotingActive,
        votes,
        mapWinner,
        handle_player_vote
    }

    return (
        <VotingContext.Provider value={voting_state}>
            { children }
        </VotingContext.Provider>
    );
}

export const useVoting = () => {
    const context = useContext(VotingContext);

    if(context === undefined) {
        throw new Error("useVoting must be used within a VotingContextProvider");
    }

    return context;
}