import { useSocket } from "../../contexts/useSocket"

const LoadingInterface = () => {
    const socket = useSocket();

    return (
        !socket?.connected && (
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                fontFamily: 'monospace',
                background: 'rgba(0,0,0,0.8)',
                padding: '30px',
                borderRadius: '10px',
                textAlign: 'center'
            }}>
                <h2>Connecting to server...</h2>
                <p>Make sure the backend is running on port 3001</p>
            </div>
        )
    );
}

export default LoadingInterface;