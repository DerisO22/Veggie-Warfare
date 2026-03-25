import { Ability } from "../Ability.js";

export class SprintAbility extends Ability {
    constructor() {
        super("Sprint", 4000);
        this.duration = 5000;
        this.sprintMultiplier = 2.0;
    }

    execute(player, params = {}) {
        if(!super.execute(player, params)) return false;

        player.applyMovementModifier( 
            "sprint",
            this.sprintMultiplier,
            "sprint_ability",
            this.duration
        )

        player.socket.emit("ability_activated", {
            ability: "sprint",
            duration: this.duration,
            multiplier: this.sprintMultiplier,
            message: "You can now run much faster"
        });

        return true;
    }
}