import { memo, useEffect, useState } from "react";
import '../../styles/gamechat.css';
import { usePlayerChat } from "../../utils/custom_hooks/usePlayerChat";
import GameChatInput from "./GameChatInput";
import { useSocket } from "../../contexts/useSocket";
import GameChatToggle from "./GameChatToggle";

const GameChat = () => {
    const { socket } = useSocket();
    const chatPayload = usePlayerChat(socket);
    const [ isVisible, setIsVisible ] = useState<boolean>(true);

    useEffect(() => {
        console.log(chatPayload);
    }, [chatPayload]);

    const formatDate = (time: number) => {
        const timeObject = new Date(time);

        const hoursString = timeObject.getHours().toString().padStart(2, '0');
        const minutes = timeObject.getMinutes().toString().padStart(2, '0');

        const hours = Number(hoursString) % 12;

        return `${hours}:${minutes} ${hours >= 12 ? "pm" : "am"}`;
    }

    const handleTextColor = () => {
        return chatPayload.color ? `${chatPayload.color.newColor.newColor[0]}` : "blue";
    };

    const handle_toggle = (e: React.MouseEvent) => {
        console.log(isVisible)
        e.preventDefault();
        setIsVisible(prev => !prev);
    }

    return (
        <>
            {isVisible && (
                <div className="player_chat_container">
                    <span className="heading">Game Chat</span>

                    <div className="messages_container">
                        <>
                            {/* Need to create a context of the gameState, so color changes and whispers can work */}
                            {chatPayload && chatPayload.broadcast_messages.map((message, index) => (
                                <div style={{ color: handleTextColor() }} key={message.from + index} className="message">
                                    <div style={{ color: handleTextColor()}} className="sender_username">[{message.from}]: </div>
                                    <div style={{ color: handleTextColor()}} className="sender_message">{message.text}</div>
                                    <div style={{ color: handleTextColor()}} className="sender_time">[{formatDate(message.time)}]</div>
                                </div>
                            ))}

                            {chatPayload && chatPayload.whisper_messages.map((message, index) => {
                                <div key={message.from + index} className="message">

                                </div>
                            })}
                        </>
                    </div>
                    
                    {socket && (
                        <GameChatInput socket={socket}/>
                    )}
                </div>
            )}

            <GameChatToggle handle_toggle={handle_toggle} isVisible={isVisible}/>
        </>
    );
}

export default memo(GameChat);