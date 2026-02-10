export interface BroadcastMessage {
    from: string,
    text: string,
    time: Date
};

export interface WhisperMessage {
    from: string,
    message: string
};

export interface HelpMessage {
    text: string,
    time: Date,
};