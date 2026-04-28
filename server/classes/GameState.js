export class GameState {
    constructor(io) {
        /**
         *  Game State Vals
         *  WAITING -> VOTING -> PLAYING -> ENDED -> WAITING
         * 
         *  WAITING with lobbyCountdownStartTime active = pre-voting countdown
         */
        this.io = io;
        this.gameState = "WAITING";
        this.teamScores = { red: 0, blue: 0 };

        // 20 second countdown before voting starts
        this.lobbyCountdownDuration = 20000;
        this.lobbyCountdownStartTime = null;

        // 6 minutes for game
        this.gameStartTime = null;
        this.gameDuration = 300000;

        // 20 secs to view leaderboard and stats
        this.endGameStartTime = null;
        this.endGameDuration = 2000;
        
        // 30 second voting time
        // this.votingDuration = 3000000;
        // this.votingStartTime = null;

        this.teams = { red: [], blue: [] };
        this.activeTimers = [];
    }

    /**
     *  lobby countdown
     */
    startLobbyCountdown() {
        console.log("Lobby countdown started! Starting voting in 5 seconds...");
        this.gameState = "WAITING"; 
        this.lobbyCountdownStartTime = Date.now();
        this.sendCurrentGameState();
    }

    /**
     *  Check if lobby countdown is complete
     */
    isLobbyCountdownComplete() {
        if (!this.lobbyCountdownStartTime) return false;
        
        const elapsed = Date.now() - this.lobbyCountdownStartTime;
        const isComplete = elapsed >= this.lobbyCountdownDuration;
        
        if (isComplete) {
            this.lobbyCountdownStartTime = null; 
        }
        
        return isComplete;
    }

    /**
     *  Get lobby countdown time remaining
     */
    getLobbyCountdownRemaining() {
        if (!this.lobbyCountdownStartTime) return 0;
        
        const elapsed = Date.now() - this.lobbyCountdownStartTime;
        return Math.max(0, this.lobbyCountdownDuration - elapsed);
    }

    getLobbyCountdownRemainingSeconds() {
        return Math.ceil(this.getLobbyCountdownRemaining() / 1000);
    }

    startVoting() {
        this.gameState = "VOTING";
        this.votingStartTime = Date.now();
        this.sendCurrentGameState();
        console.log("Voting started!");
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
        this.endGameStartTime = Date.now();
        this.sendCurrentGameState();
        console.log("Game ended! End screen showing for 20 seconds...");
    }

    /**
     *  Check if end game screen duration is complete
     */
    isEndGameScreenComplete() {
        if (!this.endGameStartTime) return false;
        
        const elapsed = Date.now() - this.endGameStartTime;
        const isComplete = elapsed >= this.endGameDuration;
        
        if (isComplete) {
            this.endGameStartTime = null;
        }
        
        return isComplete;
    }

    /**
     *  Get end game screen time remaining
     */
    getEndGameScreenRemaining() {
        if (!this.endGameStartTime) return 0;
        
        const elapsed = Date.now() - this.endGameStartTime;
        return Math.max(0, this.endGameDuration - elapsed);
    }

    getEndGameScreenRemainingSeconds() {
        return Math.ceil(this.getEndGameScreenRemaining() / 1000);
    }

    /**
     *  Reset game state back to WAITING
     */
    reset() {
        this.gameState = "WAITING";
        this.sendCurrentGameState();

        this.teamScores = { red: 0, blue: 0 };
        this.gameStartTime = null;
        this.endGameStartTime = null;
        this.lobbyCountdownStartTime = null;
        this.votingStartTime = null;
        this.teams = { red: [], blue: [] };

        console.log("GameState reset to WAITING");
    }

    /**
     *  Clear active timers 
     */
    clearTimers() {
        this.activeTimers.forEach(timer => clearTimeout(timer));
        this.activeTimers = [];
    }

    getStatus() {
        return {
            gameState: this.gameState,
            teamScores: this.teamScores,
            timeRemaining: this.getTimeRemaining(),
            timeRemainingSeconds: this.getTimeRemainingSeconds(),
            isActive: this.isGameActive(),
            lobbyCountdownRemaining: this.getLobbyCountdownRemaining(),
            endGameScreenRemaining: this.getEndGameScreenRemaining()
        };
    }

    sendCurrentGameState() {
        this.io.sockets.emit("current_game_state", this.gameState);
    }
}