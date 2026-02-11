import type { Socket } from "socket.io-client";
import type { ChatPayload, WhisperMessage } from "../types/playerChat";
import { useEffect, useState } from "react";
import type { BroadcastMessage } from "../types/playerChat";

const MAX_MESSAGES = 100;

export const usePlayerChat = (socket: Socket | null) => {
    const [ chatPayload, setChatPayload ] = useState<ChatPayload>({
        username: "",
        broadcast_messages: [],
        whisper_messages: []
    })

    useEffect(() => {
        if(!socket) return;

        const update_username = (new_username: string) => {

        }

        const update_broadcast_messages = (new_broadcast_message: BroadcastMessage) => {
            setChatPayload(prev => ({
                ...prev,
                broadcast_messages: [...prev.broadcast_messages, new_broadcast_message].slice(-MAX_MESSAGES)
            }));
        }

        const update_whisper_messages = (new_whisper_message: WhisperMessage) => {
            setChatPayload(prev => ({
                ...prev,
                whisper_messages: [...prev.whisper_messages, new_whisper_message].slice(-MAX_MESSAGES)
            }));
        }

        // on listeners
        socket.on("broadcast_message", update_broadcast_messages);
        socket.on("whisper_command", update_whisper_messages);

        return () => {
            socket.off("broadcast_message", update_broadcast_messages);
            socket.off("whisper_command", update_whisper_messages);
        }
    }, [socket]);

    return chatPayload;
};