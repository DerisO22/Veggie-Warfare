import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SocketProvider } from './utils/custom_hooks/useSocket.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
		<SocketProvider>
			<App />
		</SocketProvider>
    </StrictMode>,
)
