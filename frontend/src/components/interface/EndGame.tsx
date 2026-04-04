import { useCurrentGameState } from "../../contexts/CurrentGameState";
import { useTeam } from "../../contexts/TeamContext";

import '../../styles/end_game.css';

const EndGame = () => {
    const currentGameState = useCurrentGameState();
    const { redScore, blueScore, localPlayerTeam } = useTeam();

    if(currentGameState !== "ENDED") return;
    
    return (
        <>
            {currentGameState === "ENDED" && (
                <div className="end_game_container">
                    <h1>Game Results</h1>
                    
                    <div className="leaderboard_container">
                        Test
                    </div>
                </div>
            )}
        </>
    )
}

export default EndGame;