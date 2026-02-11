import { useState, type ChangeEvent } from "react";
import type { Socket } from "socket.io-client";

const GameChatInput = ({ socket } : {socket: Socket | null}) => {
    const [ message, setMessage ] = useState("");

    const handleSubmit = () => {
        if(!socket) return;

        if(message){
            socket.emit("send_message", { text: message });
        }

        setMessage("");
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
                />

                <button className="submit_button" type="submit">Submit</button>
            </form>
        </div>
    );
}

export default GameChatInput;