import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./useSocket";
import type { KeyBindings } from "../utils/types/controlType";
import { DEFAULT_KEYBINDS } from "../utils/consts/Keybinds";

interface AbilitiesContextType {
    abilityData: AbilitiesType | undefined,
    playerKeybinds: KeyBindings,
    updatePlayerKeybinds: (keybind_changes: KeybindChanges) => void

}

interface AbilitiesType {
    ability: string,
    duration: number,
    multiplier: number,
    message: string
}

export interface KeybindChanges {
    [key: string]: string
}

interface AbilitiesProviderProps {
    children: React.ReactNode;
}

const AbilitiesContext = createContext<AbilitiesContextType | undefined>(undefined);

export const AbilitiesProvider = ({ children }: AbilitiesProviderProps ) => {
    const { socket } = useSocket();
    const [ abilityData, setAbilityData ] = useState<AbilitiesType>();
    const [ playerKeybinds, setPlayerKeybinds ] = useState<KeyBindings>(DEFAULT_KEYBINDS);

    useEffect(() => {
        if(!socket) return;

        socket.on("ability_activated", (payload) => {
            setAbilityData(payload);
        })

        return () => {
            socket.off("ability_activated");
        }
    }, [socket]);

    const updatePlayerKeybinds = (keybind_changes: KeybindChanges) => {
        setPlayerKeybinds(prev => ({
            ...prev,
            ...keybind_changes
        }))
    }

    return (
        <AbilitiesContext.Provider value={{abilityData, playerKeybinds, updatePlayerKeybinds}}>
            { children }
        </AbilitiesContext.Provider>
    )
};

export const useAbilities = () => {
    const context = useContext(AbilitiesContext);

    if(context === undefined){
        throw new Error("useAbilities cant be used outside of a AbilitiesProvider");
    }

    return context;
}