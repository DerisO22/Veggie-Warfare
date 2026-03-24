import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./useSocket";

interface CharacterInfo {  
    [key: string]: {
        name: string,
        description: string,
        color: number,
        abilities: string[],
        playstyle: string
    }
}

interface CharacterPayloadData{
    characters: string[],
    characterInfo: CharacterInfo
}

interface CharacterSelectionContextType {
    characterData: CharacterPayloadData | undefined,
    selectedCharacter: string | undefined,
    handleCharacterSelection: (characterType: string) => void
}

const CharacterSelectionContext = createContext<CharacterSelectionContextType | undefined>(undefined);

interface CharacterSelectionProviderProps {
    children: React.ReactNode
}

export const CharacterSelectionProvider = ({ children }: CharacterSelectionProviderProps) => {
    const { socket } = useSocket();
    const [ characterData, setCharacterData ] = useState<CharacterPayloadData | undefined>();
    const [ selectedCharacter, setSelectedCharacter ] = useState<string | undefined>();

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
        <CharacterSelectionContext.Provider value={{ characterData, selectedCharacter, handleCharacterSelection}}>
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