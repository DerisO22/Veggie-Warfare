import Voting from "./Voting";
import '../../../styles/lobby.css';
import { useEffect, useMemo, useState } from "react";
import { scroll_reveal } from "../../../utils/consts/ScrollReveal";
import LobbyMenu from "./LobbyMenu";
import { useLobby } from "../../../contexts/LobbyContext";
import PlayerList from "./PlayerList";
import CharacterSelector from "./CharacterSelector";
import { useCurrentGameState } from "../../../contexts/CurrentGameState";
import { useVoting } from "../../../contexts/VotingContext";
import { useSocket } from "../../../contexts/useSocket";

const Lobby = () => {
    const { pending_player_ids } = useLobby();
    const { socket } = useSocket();
    const currentGameState = useCurrentGameState();
    const [ isPlayerListVisible, setIsPlayerListVisible ] = useState<boolean>(false);
    const { isVotingVisible, toggleVotingVisibility, hasVotingStarted, hasVotingEnded } = useVoting();

    useEffect(() => {
        scroll_reveal.reveal('.logo_container', { origin: "left" });
        scroll_reveal.reveal('.option_button_container', {
            delay: 900,
            origin: 'left',
        });
        scroll_reveal.reveal('.info_text', {origin: "left"})
    }, []);
    
    const toggleLobbyList = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsPlayerListVisible(prev => !prev);
    }

    // handling conditional rendering
    const isPlayerPending = useMemo(() => {
        return (currentGameState === "WAITING" && pending_player_ids?.includes(socket?.id || "")) ?? false;
    }, [currentGameState, pending_player_ids, socket?.id]);

    const shouldShowVoting = currentGameState === "VOTING" || (currentGameState === "WAITING" && isVotingVisible);
    const shouldShowLobby = isPlayerPending || currentGameState === "WAITING" || currentGameState === "VOTING";

    return (
        <>
            {!isVotingVisible && shouldShowLobby && (
                <div className="lobby_screen_container">
                    <div className="logo_container">
                        <img className="logo_image" src="/game_logo.webp"></img>
                    </div>

                    {/* Main Lobby Buttons */}
                    <div className="lobby_info_container">
                        <div className="options_menu">                
                            <div className="option_button_container">
                                <button onClick={toggleLobbyList} className="lobby_option_button">
                                    <div className="player_list_icon"></div>
                                    <span>PEOPLE</span>
                                </button>
                            </div>

                            <div className="option_button_container">
                                <button disabled={(hasVotingStarted && !hasVotingEnded) ? false : true} onClick={toggleVotingVisibility} className="lobby_option_button">
                                    <div className="vote_icon"></div>
                                    <span>VOTE</span>
                                </button>
                            </div>
                        </div>

                        {/* Extra Pre-Game Info */}
                        <div className="extra_lobby_info">
                            <div className="info_text">Players Waiting: <span className="highlight_text">{pending_player_ids?.length}</span></div>
                            <div className="info_text">Players Needed To Start: <span className="highlight_text">5</span></div>
                        </div>
                    </div>

                    <CharacterSelector />
                    
                    <LobbyMenu />
                    
                    {/* Player List */}
                    {isPlayerListVisible && (
                        <PlayerList />
                    )}
                </div>
            )}

            {shouldShowVoting && (
                <Voting />
            )}
        </>
    )
}

export default Lobby;