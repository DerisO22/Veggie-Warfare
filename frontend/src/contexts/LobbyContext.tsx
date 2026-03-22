import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./useSocket";

interface LobbyContextType {
    total_players: number
}

interface LobbyProviderProps {
    children: React.ReactNode;
}

const LobbyContext = createContext<LobbyContextType | undefined>(undefined);

export const LobbyProvider = ({ children }: LobbyProviderProps) => {
    const { socket } = useSocket();
    const [ playerCount, setPlayerCount ] = useState<number>(0);

    useEffect(() => {
        if(!socket) return;

        socket.on("lobby_info", (payload) => {
            console.log(payload);
            const total_players = payload.total_players || 0;

            setPlayerCount(total_players);
        })  

        return () => {
            socket.off("lobby_info");
        }
    }, [socket]); 

    return (
        <LobbyContext.Provider value={{total_players: playerCount}}>
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