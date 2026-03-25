import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./useSocket";

interface AbilitiesContextType {
    ability: string,
    duration: number,
    multiplier: number,
    message: string
}

interface AbilitiesType {
    ability: string,
    duration: number,
    multiplier: number,
    message: string
}

interface AbilitiesProviderProps {
    children: React.ReactNode;
}

const AbilitiesContext = createContext<AbilitiesContextType | undefined>(undefined);

export const AbilitiesProvider = ({ children }: AbilitiesProviderProps ) => {
    const { socket } = useSocket();
    const [ abilityData, setAbilityData ] = useState<AbilitiesType>();

    useEffect(() => {
        if(!socket) return;

        socket.on("ability_activated", (payload) => {
            setAbilityData(payload);
        })

        return () => {
            socket.off("ability_activated")
        }
    }, [socket]);

    return (
        <AbilitiesContext.Provider value={abilityData}>
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