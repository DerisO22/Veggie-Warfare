import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { io, type Socket } from "socket.io-client";

const SERVER_URL = 'http://localhost:3001';

interface SocketProviderProps {
    children: ReactNode;
}

interface SocketContextType {
    socket: Socket | null | undefined,
    isConnected: boolean
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: SocketProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected ] = useState<boolean>(false);

    useEffect(() => {
        const newSocket = io(SERVER_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log(`Connected to server: ${newSocket?.id}`);
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log(`Disconnected from server`);
        });

        newSocket.on('message', (message: string) => {
            console.log(`Server message: ${message}`);
        });

        return () => {
            newSocket.disconnect();
        }
    }, []);

    return (
        <SocketContext.Provider value={{socket, isConnected}}>
            { children }
        </SocketContext.Provider>
    )
}

export const useSocket = () => {
    const context = useContext(SocketContext);

    if(context === undefined){
        throw new Error("useSocket must be used within a SocketProvider");
    }

    return context;
}