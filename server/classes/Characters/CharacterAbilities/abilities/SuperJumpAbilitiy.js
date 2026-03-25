import { Ability } from "../Ability.js";

export class SuperJumpAbility extends Ability {
    constructor() {
        super("SuperJump", 6000); 
        this.duration = 8000;          
        this.jumpPowerMultiplier = 2.0; 
    }
   
    execute(player, params = {}) {
        if (!super.execute(player, params)) return false;
    
        player.applyJumpPowerModifier(
            "super_jump",
            this.jumpPowerMultiplier,
            "super_jump_ability",
            this.duration
        );
    
        player.socket.emit("ability_activated", {
            ability: "super_jump",
            duration: this.duration,
            multiplier: this.jumpPowerMultiplier,
            message: "You can now jump much higher!",
        });
    
        return true;
    }
}