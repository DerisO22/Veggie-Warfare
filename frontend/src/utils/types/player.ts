import type { BroadcastMessage, WhisperMessage } from "./playerChat";

export interface PlayerPosition {
    x: number;
    y: number;
    z: number;
}

export interface PlayerDrawInfo {
    id: string;
    position: PlayerPosition;
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