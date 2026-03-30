export class TeamManager {
    constructor(maxPlayersPerTeam = 4) {
        this.maxPlayersPerTeam = maxPlayersPerTeam;
        this.teams = {
            red: [],
            blue: []
        };
        this.teamColors = {
            red: 0xFF4444,
            blue: 0x4444FF
        };
    }

    /**
     * Assign a player to a team
    */
    assignPlayerToTeam(socketId, player) {
        const redCount = this.teams.red.length;
        const blueCount = this.teams.blue.length;

        // Assign to less populated team
        if (redCount <= blueCount && redCount < this.maxPlayersPerTeam) {
            this.teams.red.push({ socketId, player });
            player.team = "red";
            return "red";
        } else if (blueCount < this.maxPlayersPerTeam) {
            this.teams.blue.push({ socketId, player });
            player.team = "blue";
            return "blue";
        }

        console.warn(`No team slots available for ${socketId}`);
        return null;
    }

    /**
     * Remove player from team
     */
    removePlayer(socketId) {
        this.teams.red = this.teams.red.filter(p => p.socketId !== socketId);
        this.teams.blue = this.teams.blue.filter(p => p.socketId !== socketId);
    }

    /**
     * Get team info
     */
    getTeamInfo() {
        return {
            red: this.teams.red.map(p => ({
                socketId: p.socketId,
                nickname: p.player.nickname,
                kills: p.player.kills,
                deaths: p.player.deaths,
                character: p.player.character
            })),
            blue: this.teams.blue.map(p => ({
                socketId: p.socketId,
                nickname: p.player.nickname,
                kills: p.player.kills,
                deaths: p.player.deaths,
                character: p.player.character
            })),
            teamScores: {
                red: this.getTeamScore("red"),
                blue: this.getTeamScore("blue")
            }
        };
    }

    /**
     * total kills for a team
     */
    getTeamScore(team) {
        return this.teams[team].reduce((sum, p) => sum + (p.player.kills || 0), 0);
    }


    getTeamColor(team) {
        return this.teamColors[team];
    }

    /**
     * Check if both teams are full
     */
    isFull() {
        return this.teams.red.length >= this.maxPlayersPerTeam && 
               this.teams.blue.length >= this.maxPlayersPerTeam;
    }

    /**
     * player count per team
     */
    getTeamCounts() {
        return {
            red: this.teams.red.length,
            blue: this.teams.blue.length
        };
    }

    /**
     * Reset teams
     */
    reset() {
        this.teams = { red: [], blue: [] };
    }
}