import { createContext, useContext, useState } from "react";
import type { KeyBindings } from "../utils/types/controlType";
import type { PlayerSounds, PlayerStats } from "../utils/types/player";
import { getAllPlayerInformation, savePlayerInformation } from "../services/playerService";

export interface PlayerContextType {
    playerData: PlayerDataType | undefined,
    get_player_data: (player_clerk_id: string) => void,
    save_player_data: () => void
}

export interface PlayerDataType {
    player_clerk_id: string,
    player_keybinds: KeyBindings,
    player_stats: PlayerStats,
    player_sounds: PlayerSounds
}

interface PlayerProviderPropsType {
    children: React.ReactNode
}

export const DEFAULT_PLAYER_DATA = (clerk_user_id: string): PlayerDataType => ({
    player_clerk_id: clerk_user_id,
    player_keybinds: {
        forward: 'w',
        backward: 's',
        left: 'a',
        right: 'd',
        jump: ' ',
        ability1: 'e',
        ability2: 'shift'
    },
    player_stats: {
        stats_id: 0,
        player_kills: 0,
        player_deaths: 0,
        player_wins: 0,
        player_losses: 0,
        total_games_players: 0
    },
    player_sounds: {
        music: 50,
        sfx: 50,
        other: 50
    }
});

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children } : PlayerProviderPropsType) => {
    const [ playerData, setPlayerData ] = useState<PlayerDataType | undefined>();

    const get_player_data = async(player_clerk_id: string) => {
        try {   
            const data = await getAllPlayerInformation(player_clerk_id);
            console.log(data);

            setPlayerData(data);
        } catch (err) {
            const default_data = DEFAULT_PLAYER_DATA(player_clerk_id);

            await savePlayerInformation(default_data);
            setPlayerData(default_data);

            console.error("failed to load player data: ", err);
        }
    }

    const save_player_data = async() => {
        try {
            // const data = await save
        } catch (err) {
            
        }
    }

    return (
        <PlayerContext.Provider value={{ playerData, get_player_data, save_player_data}}>
            { children }
        </PlayerContext.Provider>
    )
}

export const usePlayerData = () => {
    const context = useContext(PlayerContext);

    if(context === undefined){
        throw new Error("usePlayerData must be used within a PlayerProvider");
    }

    return context;
}