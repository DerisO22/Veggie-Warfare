import { Ability } from "../Ability";

export class ForwardDash extends Ability {
    constructor() {
        super("forward_dash", 8000)
        this.duration = 0;
        this.launchForce = 15.0;
    }

    execute(player, params = {}) {
        if (!super.execute(player, params)) return false;

        const dashImpulse = {
            x: 0,
            y: 2,
            z: this.launchForce
        }

        player.body.applyImpulse(dashImpulse, true);

        player.socket.emit("ability_activated", {
            ability: "forward_dash",
            duration: this.duration,
        });
    }
}