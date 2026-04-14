import { createContext, useContext, useState } from "react";

export interface LightContextType {
    lightMode: number,
    toggle_light_mode: () => void,
}

export interface LightContextProviderProps {
    children: React.ReactNode,
}

const LightContext = createContext<LightContextType | undefined>(undefined);

export const LightContextProvider = ({ children }: LightContextProviderProps) => {
    // 0 is default, 1 is optimized, and 2 is Crazy
    const [ lightMode, setLightMode ] = useState<number>(0);

    const toggle_light_mode = () => {
        console.log(lightMode >= 2)
        lightMode >= 2 ? setLightMode(0) : setLightMode(prev => prev + 1);
    }

    return (
        <LightContext.Provider value={{lightMode, toggle_light_mode}}>
            {children}
        </LightContext.Provider>
    );
}

export const useLightMode = () => {
    const lightContext = useContext(LightContext);

    if(lightContext === undefined){
        throw new Error("useLightMode must be used within a light context provider");
    }

    return lightContext;
}