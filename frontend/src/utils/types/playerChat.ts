export interface BroadcastMessage {
    from: string,
    text: string,
    time: number
};

export interface WhisperMessage {
    from: string,
    text: string
};

export interface HelpMessage {
    text: string,
    time: Date,
};

export interface ChatPayload {
    username: string,
    broadcast_messages: BroadcastMessage[],
    whisper_messages: WhisperMessage[],
}