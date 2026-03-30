import { Ability } from "../Ability.js";

export class ForwardDash extends Ability {
    constructor() {
        super("forward_dash", 8000);
        this.duration = 0;
        this.launchForce = -15.0;
        this.damageAmount = 25;
        this.dashRange = 10; 
    }

    execute(player, params = {}) {
        if (!super.execute(player, params)) return false;

        const dashImpulse = {
            x: 0,
            y: 10,
            z: this.launchForce * 100
        }

        player.body.applyImpulse(dashImpulse, true);

        // Check for enemies in dash range
        this.checkForEnemiesHit(player);

        player.socket.emit("ability_activated", {
            ability: "forward_dash",
            duration: this.duration,
        });

        return true;
    }

    /**
     * Check for enemies in dash range using distance-based detection
     */
    checkForEnemiesHit(player) {
        const playerPos = player.body.translation();
        const dashDirection = { x: 0, y: 0, z: this.launchForce > 0 ? -1 : 1 };

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

            // Check if in range and in front of dash direction
            if (distance < this.dashRange) {
                // Check if target is roughly in dash direction (forward)
                const dotProduct = dz * dashDirection.z;
                if (dotProduct < 0) {  // Same direction as dash
                    otherPlayer.takeDamage(this.damageAmount, player);
                    console.log(`${player.nickname} hit ${otherPlayer.nickname} with forward dash (distance: ${distance.toFixed(2)})`);
                }
            }
        });
    }
}