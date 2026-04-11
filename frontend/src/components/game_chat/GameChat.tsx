import { memo, useState } from "react";
import '../../styles/gamechat.css';
import { usePlayerChat } from "../../utils/custom_hooks/usePlayerChat";
import GameChatInput from "./GameChatInput";
import { useSocket } from "../../contexts/useSocket";
import GameChatToggle from "./GameChatToggle";
import { useCurrentGameState } from "../../contexts/CurrentGameState";
import { useLightMode } from "../../contexts/game/LightContext";

const GameChat = () => {
    const { socket } = useSocket();
    const currentGameState = useCurrentGameState();
    const chatPayload = usePlayerChat(socket);
    const [ isVisible, setIsVisible ] = useState<boolean>(true);

    const formatDate = (time: number) => {
        const timeObject = new Date(time);

        const hoursString = timeObject.getHours().toString().padStart(2, '0');
        const minutes = timeObject.getMinutes().toString().padStart(2, '0');

        const hours = Number(hoursString);

        return `${hours}:${minutes}`;
    }

    const handleTextColor = () => {
        return chatPayload.color ? `${chatPayload.color.newColor.newColor[0]}` : "blue";
    };

    const handle_toggle = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsVisible(prev => !prev);
    }

    return (
        <>
            {currentGameState !== "VOTING" && currentGameState !== "WAITING" && isVisible && (
                <>
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

                                {chatPayload && chatPayload.whisper_messages.map((message, index) => (
                                    <div key={message.from + index} className="message">

                                    </div>
                                ))}
                            </>
                        </div>
                        
                        {socket && (
                            <GameChatInput socket={socket}/>
                        )}
                    </div>
                </>
            )}

            { currentGameState !== "VOTING" && currentGameState !== "WAITING" && (
                <GameChatToggle handle_toggle={handle_toggle} isVisible={isVisible}/>
            )}

        </>
    );
}

export default memo(GameChat);