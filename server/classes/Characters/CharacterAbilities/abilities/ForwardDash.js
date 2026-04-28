import { Ability } from "../Ability.js";

export class ForwardDash extends Ability {
    constructor() {
        super("forward_dash", 8000);
        this.duration = 0;
        this.launchForce = -200.0;
        this.damageAmount = 30;
        this.dashRange = 15; 
    }

    execute(player, params = {}) {
        if (!super.execute(player, params)) return false;

        const dashImpulse = {
            x: Math.sin(player.rotation) * this.launchForce,
            y: 0.5,
            z: Math.cos(player.rotation) * this.launchForce
        }

        player.body.applyImpulse(dashImpulse, true);

        setTimeout(() => {
            this.checkForEnemiesHit(player);
        }, 75);

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
        const dashDirX = Math.sin(player.rotation);
        const dashDirZ = Math.cos(player.rotation);
    
        Object.values(player.game.players).forEach(otherPlayer => {
            if (!otherPlayer || otherPlayer === player || otherPlayer.damageSystem.isDead) {
                return;
            }
    
            const otherPos = otherPlayer.body.translation();
            const dx = otherPos.x - playerPos.x;
            const dz = otherPos.z - playerPos.z;
            const distance = Math.sqrt(dx * dx + dz * dz);
    
            const dotProduct = (dx * dashDirX + dz * dashDirZ);
            
            console.log(`Checking ${otherPlayer.nickname}: distance=${distance.toFixed(2)}, dot=${dotProduct.toFixed(2)}, inRange=${distance < this.dashRange}, inFront=${dotProduct > 0}`);
    
            if (distance < this.dashRange && dotProduct > 0 && (otherPlayer.team !== player.team)) {
                otherPlayer.takeDamage(this.damageAmount, player);
                console.log(`HIT!`);
            }
        });
    }
}