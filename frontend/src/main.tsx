import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { SocketProvider } from './contexts/useSocket.tsx';
import { GameProvider } from './contexts/useGameState.tsx';
import { ChatInputProvider } from './contexts/ChatInput.tsx';
import { VotingContextProvider } from './contexts/Voting.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
		<SocketProvider>
		<GameProvider>
		<VotingContextProvider>
		<ChatInputProvider>
			<App />
		</ChatInputProvider>
		</VotingContextProvider>
		</GameProvider>
		</SocketProvider>
    </StrictMode>,
)
