export interface PlayerPosition {
    x: number;
    y: number;
    z: number;
}

export interface GameState {
    players: PlayerDrawInfo[];
    gameState: "WAITING" | "VOTING" | "PLAYING" | "ENDED";
    teamScores: {
        red: number;
        blue: number;
    };
    timeRemaining: number;
    timeRemainingSeconds: number;
    teamInfo: {
        red: TeamMember[];
        blue: TeamMember[];
        teamScores: {
            red: number;
            blue: number;
        };
    };
}

export interface TeamMember {
    socketId: string;
    nickname: string;
    kills: number;
    deaths: number;
    character: string;
}

export interface SavePlayerInformationType {
    player_kills: number | undefined,
    player_deaths: number | undefined,
    player_team: 'red' | 'blue' | undefined,
    red_score: number,
    blue_score: number
}

export interface PlayerDrawInfo extends PlayerPosition {
    id: string;
    position: PlayerPosition;
    rotation: number;
    team: "red" | "blue";
    kills: number;
    deaths: number;
    health: number;
    healthPercentage: number;
    isDead: boolean;
    character: string;
    nickname: string;
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