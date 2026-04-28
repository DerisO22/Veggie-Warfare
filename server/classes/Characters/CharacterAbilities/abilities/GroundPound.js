import { Ability } from "../Ability.js";

export class GroundPound extends Ability {
    constructor() {
        // 10 secs
        super("ground_pound", 10000);
        this.duration = 500;

        this.damageAmount = 40;
        this.knockbackForce = 250;
        
        // will adjust this later on
        this.radius = 6;
    }

    execute(player, params = {}) {
        if (!super.execute(player, params)) return false;

        this.checkForEnemiesHit(player);

        player.socket.emit("ability_activated", {
            ability: "ground_pound",
            duration: this.duration
        });

        return true;
    }

    /**
     * Check for enemies in ground pound range
     */
    checkForEnemiesHit(player) {
        const playerPos = player.body.translation();

        Object.values(player.game.players).forEach(otherPlayer => {
            if (!otherPlayer || otherPlayer === player || otherPlayer.damageSystem.isDead) {
                return;
            }

            const otherPos = otherPlayer.body.translation();
            
            // Calculate distance between players
            const dx = otherPos.x - playerPos.x;
            const dy = otherPos.y - playerPos.y;
            const dz = otherPos.z - playerPos.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            // Check if in range 
            if (distance < this.radius && (otherPlayer.team !== player.team)) {
                otherPlayer.takeDamage(this.damageAmount, player);
                const normalized = Math.sqrt(dx * dx + dz * dz) || 1;

                otherPlayer.body.applyImpulse({
                    x: (dx / normalized * this.knockbackForce),
                    y: 5,
                    z: (dz / normalized * this.knockbackForce),
                })

                console.log(`${player.nickname} hit ${otherPlayer.nickname} with ground pound (distance: ${distance.toFixed(2)})`);
            }
        });
    }
}