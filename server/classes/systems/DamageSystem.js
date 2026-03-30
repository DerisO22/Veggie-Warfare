export class DamageSystem {
    constructor(player, game) {
        this.player = player;
        this.game = game;
        this.maxHealth = 100;
        this.currentHealth = this.maxHealth;
        this.isDead = false;
        this.lastDamageDealer = null; 
        this.damageHistory = [];
    }

    /**
     * Deal damage to this player
     */
    takeDamage(amount, damageDealer) {
        if (this.isDead) return;

        this.currentHealth -= amount;
        this.lastDamageDealer = damageDealer;

        // Record damage for kill credit (30 second window)
        this.damageHistory.push({
            dealtBy: damageDealer,
            amount,
            timestamp: Date.now()
        });

        // Clean up old damage records
        const thirtySecondsAgo = Date.now() - 30000;
        this.damageHistory = this.damageHistory.filter(d => d.timestamp > thirtySecondsAgo);

        console.log(`${this.player.nickname} took ${amount} damage (health: ${this.currentHealth})`);

        if (this.currentHealth <= 0) {
            this.die(damageDealer);
        }
    }

    /**
     * Player dies - determine who gets the kill credit
     */
    die(killer) {
        if (this.isDead) return;

        this.isDead = true;
        this.currentHealth = 0;

        // Get primary killer (who dealt the last damage)
        const actualKiller = killer || this.lastDamageDealer;

        if (actualKiller && actualKiller !== this.player) {
            // Record the kill
            actualKiller.kills++;
            actualKiller.lastKillTime = Date.now();

            console.log(`${actualKiller.nickname} killed ${this.player.nickname}`);

            // Update team score
            this.game.GameState.updateTeamScores(actualKiller.team);

            // Emit kill event
            this.game.io.sockets.emit("player_killed", {
                killer: actualKiller.nickname,
                killerTeam: actualKiller.team,
                victim: this.player.nickname,
                victimTeam: this.player.team,
                method: "combat"
            });
        } else {
            // Death by environment/fall
            console.log(`${this.player.nickname} died`);
            this.game.io.sockets.emit("player_killed", {
                killer: null,
                victim: this.player.nickname,
                victimTeam: this.player.team,
                method: "environment"
            });
        }

        // Record death for victim
        this.player.deaths++;

        // Respawn player after 3 seconds
        setTimeout(() => {
            this.respawn();
        }, 3000);
    }

    /**
     * Respawn the player
     */
    respawn() {
        this.isDead = false;
        this.currentHealth = this.maxHealth;
        this.damageHistory = [];
        this.lastDamageDealer = null;

        // Reset position based on team spawn point
        const spawnPoint = this.getTeamSpawnPoint();
        this.player.body.setTranslation(spawnPoint, true);

        console.log(`${this.player.nickname} respawned`);
    }

    /**
     * Get spawn point for player's team
     */
    getTeamSpawnPoint() {
        // Red team spawns on one side, blue on the other
        if (this.player.team === "red") {
            return { x: -20, y: 10, z: 0 };
        } else {
            return { x: 20, y: 10, z: 0 };
        }
    }

    /**
     * Heal the player
     */
    heal(amount) {
        if (this.isDead) return;
        this.currentHealth = Math.min(this.currentHealth + amount, this.maxHealth);
    }

    /**
     * Reset health to full
     */
    resetHealth() {
        this.currentHealth = this.maxHealth;
    }

    /**
     * Get health percentage (0-100)
     */
    getHealthPercentage() {
        return (this.currentHealth / this.maxHealth) * 100;
    }

    /**
     * Get damage system info
     */
    getInfo() {
        return {
            currentHealth: this.currentHealth,
            maxHealth: this.maxHealth,
            healthPercentage: this.getHealthPercentage(),
            isDead: this.isDead
        };
    }
}