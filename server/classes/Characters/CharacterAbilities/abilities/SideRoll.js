import { Ability } from "../Ability.js";

export class SideRoll extends Ability {
    constructor() {
        super("side_roll", 5000);
        this.duration = 1000;
        this.rollForce = 1.5;
    }

    execute(player, params = {}) {
        if(!super.execute(player, params)) return false;

        const direction = params.direction || -1;

        // Apply impulse perpendicular to facing direction
        const rollRotation = player.rotation + (Math.PI / 2) * direction;
        
        player.body.applyImpulse({
            x: Math.sin(rollRotation) * this.rollForce,
            y: 0,
            z: Math.cos(rollRotation) * this.rollForce
        });

        player.socket.emit("ability_activated", {
            ability: "side_roll",
            duration: this.duration
        })

        return true;
    }
}