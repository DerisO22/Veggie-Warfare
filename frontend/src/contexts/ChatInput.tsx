import { createContext, useContext, useEffect, useState } from "react";
import type { ChatInputContextType, ChatInputProviderProps } from "../utils/types/playerChat";

const ChatInputContext = createContext<ChatInputContextType | undefined>(undefined);

export const ChatInputProvider = ({ children }: ChatInputProviderProps ) => {
    const [ isPlayerInputting, setIsPlayerInputting ] = useState<boolean>(false);

    useEffect(() => {
        setIsPlayerInputting(false);
    }, [])

    return (
        <ChatInputContext.Provider value={{ isPlayerInputting, setIsPlayerInputting }}>
            { children }
        </ChatInputContext.Provider>
    )
};

export const useChatInput = () => {
    const context = useContext(ChatInputContext);

    if(context === undefined){
        throw new Error("useChatInput cant be used outside of a ChatInputProvider");
    }

    return context;
}