import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SocketProvider } from './contexts/useSocket.tsx'
import { GameProvider } from './contexts/useGameState.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
		<SocketProvider>
			<GameProvider>
				<App />
			</GameProvider>
		</SocketProvider>
    </StrictMode>,
)
