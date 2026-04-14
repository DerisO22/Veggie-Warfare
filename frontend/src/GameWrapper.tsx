import { AbilitiesProvider } from "./contexts/AbilitiesContext";
import { CharacterSelectionProvider } from "./contexts/CharacterSelectionContext";
import { ChatInputProvider } from "./contexts/ChatInput";
import { CurrentGameStateProvider } from "./contexts/CurrentGameState";
import { LightContextProvider } from "./contexts/game/LightContext";
import { GameSoundProvider } from "./contexts/GameSoundsContext";
import { LobbyProvider } from "./contexts/LobbyContext";
import { PlayerProvider } from "./contexts/PlayerContext";
import { TeamProvider } from "./contexts/TeamContext";
import { GameProvider } from "./contexts/useGameState";
import { SocketProvider } from "./contexts/useSocket";
import { VotingContextProvider } from "./contexts/VotingContext";
import Game from "./Game";

const GameWrapper = () => {
    return (
        <SocketProvider>
            <GameProvider>
            <CurrentGameStateProvider>
            <TeamProvider>
                <PlayerProvider>
                <AbilitiesProvider>
                <GameSoundProvider>
                <LightContextProvider>
                <LobbyProvider>
                <VotingContextProvider>
                <CharacterSelectionProvider>
                <ChatInputProvider>
                    <Game />
                </ChatInputProvider>
                </CharacterSelectionProvider>
                </VotingContextProvider>
                </LobbyProvider>
                </LightContextProvider>
                </GameSoundProvider>
                </AbilitiesProvider>
                </PlayerProvider>
            </TeamProvider>
            </CurrentGameStateProvider>
            </GameProvider>
        </SocketProvider>
    )
}

export default GameWrapper;