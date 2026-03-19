import Voting from "./Voting";
import '../../../styles/lobby.css';
import { useEffect, useState } from "react";
import { scroll_reveal } from "../../../utils/consts/ScrollReveal";
import LobbyMenu from "./LobbyMenu";

const Lobby = () => {
    const [ isPlayerVoting, setIsPlayerVoting ] = useState<boolean>(true);

    useEffect(() => {
        scroll_reveal.reveal('.logo_container', { origin: "left" });
    }, []);

    return (
        <div className="lobby_screen_container">
            {/* Info and Stuff */}
            <div className="logo_container">
                <img className="logo_image" src="../../../../public/game_logo.webp"></img>
            </div>

            { isPlayerVoting && (
                <Voting />    
            )}
            
            <LobbyMenu />
        </div>
    )
}

export default Lobby;