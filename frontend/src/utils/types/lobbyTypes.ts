import type { ReactNode } from "react";

/**
 * Lobby Context
 */
export interface LobbyContextType {
    total_players: number,
    pending_player_ids: string[] | undefined
}

export interface LobbyProviderProps {
    children: React.ReactNode;
}

/**
 * Character Selection Context
 */
export interface CharacterInfo {  
    [key: string]: {
        name: string,
        description: string,
        color: number,
        abilities: string[],
        playstyle: string
    }
}

export interface CharacterPayloadData{
    characters: string[],
    characterInfo: CharacterInfo
}

export interface CharacterSelectionContextType {
    characterData: CharacterPayloadData | undefined,
    selectedCharacter: string | undefined,
    setSelectedCharacter: React.Dispatch<React.SetStateAction<string | undefined>>
    handleCharacterSelection: (characterType: string) => void
}

export interface CharacterSelectionProviderProps {
    children: React.ReactNode
}

/**
 * Voting Context
 */
export interface VotingContextType {
    hasVotingStarted: boolean;
    hasVotingEnded: boolean;
    votes: VotesType;
    mapWinner: string;
    handle_player_vote: (e: React.MouseEvent<HTMLDivElement>, choice: string) => void;
    isVotingVisible: boolean;
    toggleVotingVisibility: () => void
}

export interface VotingContextProviderProps {
    children: ReactNode;
}

export interface VotesType {
    map1: number;
    map2: number;
    map3: number;
}