import { createContext, useContext, useState } from "react";
import type { GameSoundContextType, SoundSettingsType, GameSoundProviderProps, SoundType } from "../utils/types/gameSettingsTypes";
import walkingSound from "../audio/walking.mp3"
import jumpSound from "../audio/jump.mp3"
export const DEFAULT_SOUND_VALUES = {
    sfx: 50,
    music: 50,
    other: 50
}

const GameSoundContext = createContext<GameSoundContextType | undefined>(undefined);

export const GameSoundProvider = ({ children }: GameSoundProviderProps) => {
    const [ volumeLevels, setVolumeLevels ] = useState<SoundSettingsType>(DEFAULT_SOUND_VALUES);
  const playSounds = (type: SoundType) => {
        const asset = type === 'jump' ? jumpSound : walkingSound;
        const audio = new Audio(asset);
        audio.volume = volumeLevels.sfx / 100; // = not -
        audio.play().catch(err => console.error("Playback failed:", err));
    }
    const handleVolumeChange = (volumeSetting: string, value: number) => {
        setVolumeLevels(prev => ({ ...prev, [volumeSetting]: value}));
    } 

    return (
        <GameSoundContext.Provider value={{volumeLevels, playSounds, handleVolumeChange}}>
            { children }
        </GameSoundContext.Provider>
    )
}

export const useGameSound = () => {
    const context = useContext(GameSoundContext);

    if(context === undefined){
        throw new Error("useGameSound must be used within a GameSoundProvider");
    }

    return context;
}