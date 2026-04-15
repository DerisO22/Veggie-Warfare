import { useEffect, useRef } from "react";
import { useCurrentGameState } from "../../contexts/CurrentGameState";
import { useTeam } from "../../contexts/TeamContext";
import '../../styles/end_game.css';
import { useUser } from "@clerk/clerk-react";
import { useGameState } from "../../contexts/useGameState";
import { savePlayerStats } from "../../services/playerService";
import { useSocket } from "../../contexts/useSocket";

const EndGame = () => {
    const currentGameState = useCurrentGameState();
    const { redTeam, blueTeam, redScore, blueScore } = useTeam();
    const { user } = useUser();
    const { socket } = useSocket();
    const gameState = useGameState();
    const hasStatsSaved = useRef(false);

    useEffect(() => {
        if (currentGameState === "ENDED" && user?.id && !hasStatsSaved.current) {
            hasStatsSaved.current = true; 
            
            const localPlayer = gameState.players.find(p => p.id === socket?.id);

            if (localPlayer) {
                const player_data = {
                    player_kills: localPlayer.kills,
                    player_deaths: localPlayer.deaths,
                    player_team: localPlayer.team,
                    red_score: gameState.teamScores.red,
                    blue_score: gameState.teamScores.blue
                }
                
                savePlayerStats(user.id, player_data)
                    .catch(err => console.error('Failed to save stats:', err));
            }
        }

        if (currentGameState !== "ENDED") {
            hasStatsSaved.current = false;
        }
    }, [currentGameState, user?.id]);

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
                                <div className="player_entry blue_roster" key={player.nickname + index}>
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