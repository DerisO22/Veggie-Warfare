export interface PlayerPosition {
    x: number;
    y: number;
    z: number;
}

export interface PlayerDrawInfo {
    id: string;
    position: PlayerPosition;
}

export interface PlayerStats {
    stats_id: number,
    player_kills: number,
    player_deaths: number,
    player_wins: number,
    player_losses: number,
    total_games_players: number
}

export interface PlayerSounds {
    music: number,
    sfx: number,
    other: number
}

export interface GameState {
    players: PlayerDrawInfo[];
}

export interface Position {
    x: number;
    y: number;
    z: number;
}

export interface ButtonInput {
    button: 'forward' | 'backward' | 'left' | 'right';
    value: boolean;
}

// Socket event types
export interface ServerToClientEvents {
    sendState: (state: GameState) => void;
    message: (message: string) => void;
}

export interface ClientToServerEvents {
    setButton: (input: ButtonInput) => void;
}