import { useSocket } from "../../../contexts/useSocket";

const Exit = () => {
    const { socket } = useSocket();

    const handlePlayerExit = (e: React.MouseEvent) => {
        e.preventDefault();
        if(!socket) return;

        socket.emit("disconnect");

        console.log("disconnected");
    };

    return (
        <button onClick={() => handlePlayerExit} className="exit_button"></button>
    )
}

export default Exit
