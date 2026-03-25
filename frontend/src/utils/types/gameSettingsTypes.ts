/**
 * Game Sounds Context
 */
export interface GameSoundContextType {
    volumeLevels: SoundSettingsType,
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