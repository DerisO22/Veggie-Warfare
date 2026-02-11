import { useEffect } from "react";
import '../../styles/gamechat.css';
import { usePlayerChat } from "../../utils/custom_hooks/usePlayerChat";
import GameChatInput from "./GameChatInput";
import { useSocket } from "../../utils/custom_hooks/useSocket";

const GameChat = () => {
    const socket = useSocket();
    const chatPayload = usePlayerChat(socket);

    useEffect(() => {
        console.log(chatPayload);
    }, [chatPayload]);

    return (
        <div className="player_chat_container">
            <span className="heading">Game Chat</span>

            {chatPayload && chatPayload.broadcast_messages.map((message, index) => (
                <div key={message.from + index} className="annoucement_message">
                    <span className="sender_username">{message.from}</span>
                    <span className="sender_message">{message.text}</span>
                    <span className="sender_time">{message.time}</span>
                </div>
            ))}
            
            <GameChatInput socket={socket}/>
        </div>
    );
}

export default GameChat;