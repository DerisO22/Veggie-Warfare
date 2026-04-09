import Voting from "./Voting";
import '../../../styles/lobby.css';
import { useEffect, useState } from "react";
import { scroll_reveal } from "../../../utils/consts/ScrollReveal";
import LobbyMenu from "./LobbyMenu";
import { useLobby } from "../../../contexts/LobbyContext";
import PlayerList from "./PlayerList";
import CharacterSelector from "./CharacterSelector";
import { useCurrentGameState } from "../../../contexts/CurrentGameState";
import { useVoting } from "../../../contexts/VotingContext";

const Lobby = () => {
    const { total_players } = useLobby();
    const currentGameState = useCurrentGameState();
    const [ isPlayerListVisible, setIsPlayerListVisible ] = useState<boolean>(false);
    const { isVotingVisible, toggleVotingVisibility } = useVoting();

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

    const shouldShowVoting = currentGameState === "VOTING" || (currentGameState === "WAITING" && isVotingVisible);
    const shouldShowLobby = currentGameState === "WAITING" || currentGameState === "VOTING";

    return (
        <>
            {!isVotingVisible && shouldShowLobby && (
                <div className="lobby_screen_container">
                    <div className="logo_container">
                        <img className="logo_image" src="../../../../public/game_logo.webp"></img>
                    </div>

                    {/* Main Lobby Buttons */}
                    <div className="lobby_info_container">
                        <div className="options_menu">
                            <div className="option_button_container">
                                <button className="lobby_option_button">
                                    <div className="play_icon"></div>
                                    <span>PLAY</span>
                                </button>
                            </div>
                            
                            <div className="option_button_container">
                                <button onClick={toggleLobbyList} className="lobby_option_button">
                                    <div className="player_list_icon"></div>
                                    <span>PEOPLE</span>
                                </button>
                            </div>

                            <div className="option_button_container">
                                <button onClick={toggleVotingVisibility} className="lobby_option_button">
                                    <div className="vote_icon"></div>
                                    <span>VOTE</span>
                                </button>
                            </div>
                        </div>

                        {/* Extra Pre-Game Info */}
                        <div className="extra_lobby_info">
                            <div className="info_text">Players Waiting: <span className="highlight_text">{total_players}</span></div>
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