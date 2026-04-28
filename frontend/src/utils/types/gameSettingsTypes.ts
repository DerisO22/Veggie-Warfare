/**
 * Game Sounds Context
 */
export type SoundType = 'jump' | 'walk';
export interface GameSoundContextType {
    volumeLevels: SoundSettingsType,
    playSounds: (type: SoundType) => void,
    handleVolumeChange: (volumeSetting: string, value: number) => void
}

export interface SoundSettingsType {
    sfx: number,
    music: number,
    other: number
}

export interface GameSoundProviderProps {
    children: React.ReactNode
}