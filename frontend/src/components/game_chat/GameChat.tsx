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
                <>
                    {/* Need to create a context of the gameState, so color changes and whispers can work */}
                    {chatPayload && chatPayload.broadcast_messages.map((message, index) => (
                        <div style={{ backgroundColor: `${chatPayload.color ? `${chatPayload.color.newColor.newColor[0]}` : "transparent"}`}} key={message.from + index} className="message">
                            <div className="sender_username">[{message.from}]: </div>
                            <div className="sender_message">{message.text}</div>
                            <div className="sender_time">{formatDate(message.time)}</div>
                        </div>
                    ))}

                    {chatPayload && chatPayload.whisper_messages.map((message, index) => {
                        <div key={message.from + index} className="message">

                        </div>
                    })}
                </>
            </div>
            
            <GameChatInput socket={socket}/>
        </div>
    );
}

export default GameChat;