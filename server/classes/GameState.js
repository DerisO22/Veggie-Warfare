export class GameState {
    constructor(io) {
        /**
         * Game State Vals
         * WAITING -> VOTING -> PLAYING -> ENDED
         */
        this.io = io;
        this.gameState = "WAITING";
        this.teamScores = { red: 0, blue: 0 };
        this.gameStartTime = null;

        // 10 mins
        this.gameDuration = 20000;

        // end game screen gonna be 30 secs to view leaderboard
        // and allow for saving player data
        this.endGameDuration = 30000;
        
        // 30 second voting time as well
        this.votingDuration = 30000;

        // prob will not have this and will be just a part of voting time
        this.lobbyWaitDuration = 30000;

        this.teams = { red: [], blue: [] };
    }

    startVoting() {
        this.gameState = "VOTING";
        this.sendCurrentGameState();
    }

    startGame() {
        this.gameState = "PLAYING";
        this.sendCurrentGameState();
        this.gameStartTime = Date.now();
        this.teamScores = { red: 0, blue: 0 };
        console.log("Game started!");
    }

    getTimeRemaining() {
        if (!this.gameStartTime) return this.gameDuration;

        const elapsed = Date.now() - this.gameStartTime;
        return Math.max(0, this.gameDuration - elapsed);
    }

    getTimeRemainingSeconds() {
        return Math.floor(this.getTimeRemaining() / 1000);
    }

    isGameActive() {
        return this.gameState === "PLAYING" && this.getTimeRemaining() > 0;
    }

    endGame() {
        this.gameState = "ENDED";
        this.sendCurrentGameState();
        console.log("Game ended!");

        this.gameState = "WAITING";
        this.sendCurrentGameState();
    }

    updateTeamScores(killerTeam) {
        if (killerTeam === "red" || killerTeam === "blue") {
            this.teamScores[killerTeam]++;
        }
    }

    getStatus() {
        return {
            gameState: this.gameState,
            teamScores: this.teamScores,
            timeRemaining: this.getTimeRemaining(),
            timeRemainingSeconds: this.getTimeRemainingSeconds(),
            isActive: this.isGameActive()
        };
    }

    reset() {
        this.gameState = "WAITING";
        this.sendCurrentGameState();
        this.teamScores = { red: 0, blue: 0 };
        this.gameStartTime = null;
        this.teams = { red: [], blue: [] };
    }

    sendCurrentGameState() {
        this.io.sockets.emit("current_game_state", this.gameState);
    }
}