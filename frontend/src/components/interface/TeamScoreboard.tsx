import { memo } from "react";
import { useTeam } from "../../contexts/TeamContext";
import { useGameState } from "../../contexts/useGameState";
import "../../styles/team_scoreboard.css";
import { useVoting } from "../../contexts/VotingContext";

const TeamScoreboard = () => {
    const { redTeam, blueTeam, redScore, blueScore, localPlayerTeam } = useTeam();
    const gameState = useGameState();
    const { hasVotingStarted, hasVotingEnded } = useVoting();

    return (
        <>
            {!hasVotingStarted && hasVotingEnded && (
                <div className="team_scoreboard_container">
                    {/* Score Display */}
                    <div className="team_score_display">
                        <div className={`team_score red ${localPlayerTeam === "red" ? "local_team" : ""}`}>
                            <div className="team_name">GA</div>
                            <div className="team_score_value">{redScore}</div>
                        </div>

                        {/* Timer */}
                        <div className="game_timer">
                            <div className="time_value">
                                {String(Math.floor(gameState.timeRemainingSeconds / 60)).padStart(2, "0")}:
                                {String(gameState.timeRemainingSeconds % 60).padStart(2, "0")}
                            </div>
                            <div className="time_label">
                                {gameState.gameState === "PLAYING" ? "Time Left" : "Game Ended"}
                            </div>
                        </div>

                        <div className={`team_score blue ${localPlayerTeam === "blue" ? "local_team" : ""}`}>
                            <div className="team_name">NN</div>
                            <div className="team_score_value">{blueScore}</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default memo(TeamScoreboard);