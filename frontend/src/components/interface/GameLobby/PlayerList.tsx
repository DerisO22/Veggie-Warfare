import { useLayoutEffect } from "react";
import { useLobby } from "../../../contexts/LobbyContext";
import '../../../styles/lobby.css';
import { scroll_reveal } from "../../../utils/consts/ScrollReveal";
import { generateRandomRGBAColor } from "../../../utils/helpers/colors";


const PlayerList = () => {
    const { total_players, pending_player_ids } = useLobby();

    useLayoutEffect(() => {
        scroll_reveal.reveal('.player_list_container', { 
            origin: "right",
            duration: 500
        });
    }, []);

    return (
        <div className="player_list_container">
            <div className="player_list_header">Total Players: {total_players}</div>

            <div className="players_container">
                {pending_player_ids?.map((player_id, index) => (
                    <div style={{ backgroundColor: generateRandomRGBAColor()}} key={index + player_id} className="player_list_item_container">
                        <div className="player_list_item">Player {player_id.slice(0, 10)}</div>
                        <div className="player_icon"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PlayerList;