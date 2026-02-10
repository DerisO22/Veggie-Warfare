import { useState, type ChangeEvent } from "react";
import type { Socket } from "socket.io-client";

export interface Message {
    message: string;
}

const GameChatInput = (socket: Socket | null) => {
    const [ formData, setFormData ] = useState<Message>({ message: "" });

    const handleSubmit = () => {
        if(!socket) return;

        if(formData){
            socket.emit("send_message", { text: formData.message });
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        setFormData(prev => ({
            ...prev,
            message: value
        }));
    }

    return (
        <div>
            <form className="chat_form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="message_input"
                    value={formData?.message}
                    onChange={handleChange}
                    placeholder="Enter message..."
                />

                <button className="submit_button" type="submit">Submit</button>
            </form>
        </div>
    );
}

export default GameChatInput;