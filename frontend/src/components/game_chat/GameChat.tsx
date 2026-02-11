import { useEffect } from "react";
import '../../styles/gamechat.css';
import { usePlayerChat } from "../../utils/custom_hooks/usePlayerChat";
import GameChatInput from "./GameChatInput";
import { useSocket } from "../../contexts/useSocket";

const GameChat = () => {
    const socket = useSocket();
    const chatPayload = usePlayerChat(socket);

    useEffect(() => {
        console.log(chatPayload);
    }, [chatPayload]);

    const formatDate = (time: number) => {
        const timeObject = new Date(time)

        const hours = timeObject.getHours().toString().padStart(2, '0');
        const minutes = timeObject.getMinutes().toString().padStart(2, '0');

        return `${hours}:${minutes}`;
    }

    return (
        <div className="player_chat_container">
            <span className="heading">Game Chat</span>

            <div className="messages_container">
                {chatPayload && chatPayload.broadcast_messages.map((message, index) => (
                    <div key={message.from + index} className="annoucement_message">
                        <span className="sender_username">[{message.from}]: </span>
                        <span className="sender_message">{message.text}</span>
                        <span className="sender_time">{formatDate(message.time)}</span>
                    </div>
                ))}
            </div>
            
            <GameChatInput socket={socket}/>
        </div>
    );
}

export default GameChat;