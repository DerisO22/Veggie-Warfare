import Voting from "./Voting";
import '../../../styles/lobby.css';
import { useEffect } from "react";
import { scroll_reveal } from "../../../utils/consts/ScrollReveal";
import LobbyMenu from "./LobbyMenu";
import { useVoting } from "../../../contexts/VotingContext";
import { useLobby } from "../../../contexts/LobbyContext";

const Lobby = () => {
    const { total_players } = useLobby();
    const { hasVotingStarted, hasVotingEnded } = useVoting();

    useEffect(() => {
        scroll_reveal.reveal('.logo_container', { origin: "left" });
    }, []);

    return (
        <>
            {!hasVotingStarted && !hasVotingEnded && (
                <div className="lobby_screen_container">
                    {/* Info and Stuff */}
                    <div className="logo_container">
                        <img className="logo_image" src="../../../../public/game_logo.webp"></img>
                    </div>

                    <div className="lobby_info_container">
                        <div className="options_menu">
                            <button className="lobby_option_button">
                                <div className="play_icon"></div>
                                <span>PLAY</span>
                            </button>
                            <button className="lobby_option_button">
                                <div className="player_list_icon"></div>
                                <span>PEOPLE</span>
                            </button>
                            <button className="lobby_option_button">
                                <div className="vote_icon"></div>
                                <span>VOTE</span>
                            </button>
                        </div>
                        <p className="info_text">Players Waiting: <span className="highlight_text">{total_players}</span></p>
                        <p className="info_text">Players Needed: <span className="highlight_text">6</span></p>
                    </div>
                    
                    <LobbyMenu />
                </div>
            )}

            {hasVotingStarted && !hasVotingEnded && (
                <Voting />
            )}
        </>
    )
}

export default Lobby;