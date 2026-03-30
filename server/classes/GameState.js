export class GameState {
    constructor() {
        /**
         * Game State Vals
         * WAITING -> VOTING -> PLAYING -> ENDED
         */
        this.gameState = "WAITING";
        this.teamScores = { red: 0, blue: 0 };
        this.gameStartTime = null;

        // 10 mins
        this.gameDuration = 600000;
        this.teams = { red: [], blue: [] };
    }

    startGame() {
        this.gameState = "PLAYING";
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
        console.log("Game ended!");
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
        this.teamScores = { red: 0, blue: 0 };
        this.gameStartTime = null;
        this.teams = { red: [], blue: [] };
    }
}