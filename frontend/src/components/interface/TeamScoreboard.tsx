import { memo } from "react";
import { useTeam } from "../../contexts/TeamContext";
import { useGameState } from "../../contexts/useGameState";
import "../../styles/team_scoreboard.css";

const TeamScoreboard = () => {
    const { redTeam, blueTeam, redScore, blueScore, localPlayerTeam } = useTeam();
    const gameState = useGameState();

    return (
        <div className="team_scoreboard_container">
            {/* Score Display */}
            <div className="team_score_display">
                <div className={`team_score red ${localPlayerTeam === "red" ? "local_team" : ""}`}>
                    <div className="team_name">RED TEAM</div>
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
                    <div className="team_name">BLUE TEAM</div>
                    <div className="team_score_value">{blueScore}</div>
                </div>
            </div>

            {/* Team Rosters */}
            {gameState.gameState === "PLAYING" && (
                <div className="team_rosters">
                    {/* Red Team Roster */}
                    <div className="team_roster red_roster">
                        <div className="roster_header">Red Team</div>
                        <div className="roster_players">
                            {redTeam.map((player) => (
                                <div
                                    key={player.socketId}
                                    className={`roster_player ${player.socketId === gameState.players.find(p => p.id === player.socketId)?.id ? "alive" : "dead"}`}
                                >
                                    <div className="player_name">{player.nickname}</div>
                                    <div className="player_stats">
                                        <span className="stat kills">{player.kills}K</span>
                                        <span className="stat deaths">{player.deaths}D</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Blue Team Roster */}
                    <div className="team_roster blue_roster">
                        <div className="roster_header">Blue Team</div>
                        <div className="roster_players">
                            {blueTeam.map((player) => (
                                <div
                                    key={player.socketId}
                                    className={`roster_player ${player.socketId === gameState.players.find(p => p.id === player.socketId)?.id ? "alive" : "dead"}`}
                                >
                                    <div className="player_name">{player.nickname}</div>
                                    <div className="player_stats">
                                        <span className="stat kills">{player.kills}K</span>
                                        <span className="stat deaths">{player.deaths}D</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(TeamScoreboard);