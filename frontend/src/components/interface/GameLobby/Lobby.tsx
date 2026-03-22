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

    console.log(total_players);

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
                    
                    <LobbyMenu />
                </div>
            )}

            { hasVotingStarted && !hasVotingEnded && (
                <Voting />
            )}
        </>
    )
}

export default Lobby;