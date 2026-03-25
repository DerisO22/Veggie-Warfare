import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { SocketProvider } from './contexts/useSocket.tsx';
import { GameProvider } from './contexts/useGameState.tsx';
import { ChatInputProvider } from './contexts/ChatInput.tsx';
import { VotingContextProvider } from './contexts/VotingContext.tsx';
import { LobbyProvider } from './contexts/LobbyContext.tsx';
import { GameSoundProvider } from './contexts/GameSoundsContext.tsx';
import { CharacterSelectionProvider } from './contexts/CharacterSelectionContext.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
		<SocketProvider>
			<GameProvider>
				<GameSoundProvider>
				<LobbyProvider>
				<VotingContextProvider>
				<CharacterSelectionProvider>
				<ChatInputProvider>
					<App />
				</ChatInputProvider>
				</CharacterSelectionProvider>
				</VotingContextProvider>
				</LobbyProvider>
				</GameSoundProvider>
			</GameProvider>
		</SocketProvider>
    </StrictMode>,
)
