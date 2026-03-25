import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./useSocket";
import type { LobbyContextType, LobbyProviderProps } from "../utils/types/lobbyTypes";

const LobbyContext = createContext<LobbyContextType | undefined>(undefined);

export const LobbyProvider = ({ children }: LobbyProviderProps) => {
    const { socket } = useSocket();
    const [ playerCount, setPlayerCount ] = useState<number>(0);
    const [ pendingPlayers, setPendingPlayers ] = useState<string[]>();

    useEffect(() => {
        if(!socket) return;

        socket.on("lobby_info", (payload) => {
            const total_players = payload.total_players || 0;
            setPendingPlayers(payload.pending_socket_ids);

            setPlayerCount(total_players);
        })  

        return () => {
            socket.off("lobby_info");
        }
    }, [socket]); 

    return (
        <LobbyContext.Provider value={{total_players: playerCount, pending_player_ids: pendingPlayers }}>
            {children}
        </LobbyContext.Provider>
    )
}

export const useLobby = () => {
    const context = useContext(LobbyContext);

    if(context === undefined){
        throw new Error("useLobby must be used within a Lobby Provider");
    }

    return context;
}