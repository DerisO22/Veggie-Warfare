import { useCurrentGameState } from "../../contexts/CurrentGameState";
import { useTeam } from "../../contexts/TeamContext";
import '../../styles/end_game.css';

const EndGame = () => {
    const currentGameState = useCurrentGameState();
    const { redTeam, blueTeam, redScore, blueScore } = useTeam();

    if(currentGameState !== "ENDED") return;

    const getWinner = () => {
        if(redScore === blueScore) return "Tie!";

        return redScore > blueScore ? "Garden Alliance Win!" : "Nightshade Nation Win!";
    }
    
    return (
        <>
            {currentGameState === "ENDED" && (
                <div className="end_game_container">
                    <div className="endgame_header">Game Results</div>

                    <div className="endgame_result_header">{redScore} - {blueScore}</div>
                    <div className="endgame_result_header">{getWinner()}</div>

                    <div className="team_rosters">
                        <div className="team_roster red_roster">
                            <h1 className="roster_header">Garden Alliance</h1>
                            <div className="leaderboard_header_container">
                                <span className="leaderboard_header red_team">Player</span>
                                <span className="leaderboard_header red_team">Kills</span>
                                <span className="leaderboard_header red_team">Deaths</span>
                                <span className="leaderboard_header red_team">K/D</span>
                            </div>
                            {redTeam.map((player, index) => (
                                <div className="player_entry" key={player.nickname + index}>
                                    <span className="player_info">{player.nickname}</span>
                                    <span className="player_info">{player.kills}</span>
                                    <span className="player_info">{player.deaths}</span>
                                    <span className="player_info"></span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="team_roster blue_roster">
                            <h1 className="roster_header">Nightshade Nation</h1>
                            <div className="leaderboard_header_container">
                                <span className="leaderboard_header blue_team">Player</span>
                                <span className="leaderboard_header blue_team">Kills</span>
                                <span className="leaderboard_header blue_team">Deaths</span>
                                <span className="leaderboard_header blue_team">K/D</span>
                            </div>
                            {blueTeam.map((player, index) => (
                                <div className="player_entry blue_roster" key={player.nickname}>
                                    <div className="player_info">{player.nickname.substring(0, 4)}</div>
                                    <div className="player_info">{player.kills}</div>
                                    <div className="player_info">{player.deaths}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default EndGame;