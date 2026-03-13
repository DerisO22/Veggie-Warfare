import Exit from "./Exit";
import Voting from "./Voting";
import '../../../styles/lobby.css';

const Lobby = () => {
    return (
        <div className="lobby_screen_container">
            {/* Info and Stuff */}
            <div className="logo_container">
                <img className="logo_image" src="../../../../public/game_logo.webp"></img>
            </div>

            <Voting />
            <Exit />
        </div>
    )
}

export default Lobby;