import { useState, type ChangeEvent } from "react";
import type { Socket } from "socket.io-client";
import { useChatInput } from "../../contexts/ChatInput";

const GameChatInput = ({ socket } : { socket: Socket | null }) => {
    const [ message, setMessage ] = useState<string>("");
    const { setIsPlayerInputting } = useChatInput();

    const handleSubmit = () => {
        if(!socket) return;

        if(message){
            socket.emit("send_message", { text: message });
        }

        setMessage("");
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { value } = e.target;
        setMessage(value);
    }

    return (
        <div className="message_form_container">
            <form className="chat_form" onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}>
                <input
                    type="text"
                    name="message_input"
                    className="message_input"
                    value={message}
                    onChange={handleChange}
                    placeholder="Enter message..."
                    maxLength={100}
                    onFocus={(e) => {
                        e.preventDefault();
                        setIsPlayerInputting(true);
                    }}
                    onBlur={(e) => {
                        e.preventDefault();
                        setIsPlayerInputting(false);
                    }}
                />

                <button className="submit_button" type="submit">Submit</button>
            </form>
        </div>
    );
}

export default GameChatInput;