import { useSocket } from "../../contexts/useSocket";
import '../../styles/interface.css';

const LoadingInterface = () => {
    const socket = useSocket();

    return (
        !socket?.connected && (
            <div className="loading_container">
                <h2>Connecting to server...</h2>
                <p>Make sure the backend is running on port 3001</p>
            </div>
        )
    );
}

export default LoadingInterface;