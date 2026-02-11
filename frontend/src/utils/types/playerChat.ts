export interface BroadcastMessage {
    from: string,
    text: string,
    time: number,
};

export interface WhisperMessage {
    from: string,
    text: string
};

export interface HelpMessage {
    text: string,
    time: number,
};

export interface ChatPayload {
    color: { newColor: { newColor: string[]} },
    username: string,
    broadcast_messages: BroadcastMessage[],
    whisper_messages: WhisperMessage[],
}