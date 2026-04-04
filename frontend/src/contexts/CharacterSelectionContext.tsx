import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./useSocket";
import type { CharacterSelectionContextType, CharacterPayloadData, CharacterSelectionProviderProps } from "../utils/types/lobbyTypes";

const CharacterSelectionContext = createContext<CharacterSelectionContextType | undefined>(undefined);

export const CharacterSelectionProvider = ({ children }: CharacterSelectionProviderProps) => {
    const { socket } = useSocket();
    const [ characterData, setCharacterData ] = useState<CharacterPayloadData | undefined>();
    const [ selectedCharacter, setSelectedCharacter ] = useState<string | undefined>("carrot");

    useEffect(() => {
        if(!socket) return;

        socket.on("available_characters", (payload) => {
            setCharacterData(payload);
        });

        return() => {
            socket.off("available_characters");
        }
    }, [socket])

    const handleCharacterSelection = (characterType: string) => {
        setSelectedCharacter(characterType);
        socket?.emit("select_character", { character: characterType });
    }

    return (
        <CharacterSelectionContext.Provider value={{ characterData, selectedCharacter, setSelectedCharacter, handleCharacterSelection}}>
            { children }
        </CharacterSelectionContext.Provider>
    )
}

export const useCharacterSelect = () => {
    const context = useContext(CharacterSelectionContext);

    if(context === undefined) {
        throw new Error("useCharacterSelect must be used within a CharacterSelectionProvider");
    }

    return context;
}