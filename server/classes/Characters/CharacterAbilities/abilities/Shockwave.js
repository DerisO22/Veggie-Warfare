import { Ability } from "../Ability.js";

export class Shockwave extends Ability {
    constructor() {
        super("shockwave", 8000);
        this.radius = 5;
        this.knockbackForce = 400;
    }

    execute(player, params = {}) {
        if(!super.execute(player, params)) return false;

        this.checkForEnemiesHit(player);

        player.socket.emit("ability_activated", {
            ability: "shockwave",
            duration: 0
        });

        return true;
    }

    checkForEnemiesHit(player) {
        const playerPos = player.body.translation();

        Object.values(player.game.players).forEach(otherPlayer => {
            if (!otherPlayer || otherPlayer === player || otherPlayer.damageSystem.isDead) {
                return;
            }

            const otherPos = otherPlayer.body.translation();
            const dx = otherPos.x - playerPos.x;
            const dz = otherPos.z - playerPos.z;
            const distance = Math.sqrt(dx * dx + dz * dz);

            if (distance < this.radius && distance > 0) {
                const normalized = distance;
                const currentVel = otherPlayer.body.linvel();

                otherPlayer.body.applyImpulse({
                    x: (dx / normalized) * this.knockbackForce,
                    y: 20,
                    z: (dz / normalized) * this.knockbackForce
                });

                console.log(`${player.nickname} shockwaved ${otherPlayer.nickname}`);
            }
        });
    }
}