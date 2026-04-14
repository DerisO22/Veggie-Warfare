import { SprintAbility } from "./CharacterAbilities/abilities/SprintAbility.js";
import { AbilitySystem } from "./CharacterAbilities/AbilitySystem.js";
import { Player } from "../Player.js";
import { SuperJumpAbility } from "./CharacterAbilities/abilities/SuperJumpAbilitiy.js";
import { Shockwave } from "./CharacterAbilities/abilities/Shockwave.js";

export class Cucumber extends Player {
    constructor(game, socket) {
        super(game, socket, { x: 1, y: 1, z: 1 });

        this.character = "cucumber";
        this.characterColor = 0x67ab05;
        this.abilitySystem = new AbilitySystem(this);
        this.abilitySystem.addAbility("sprint", new SprintAbility());
        this.abilitySystem.addAbility("super_jump", new SuperJumpAbility());
        this.abilitySystem.addAbility("shockwave", new Shockwave());
    }

    update() {
        super.update();

        this.abilitySystem.update();
    }

    getDrawInfo() {
        const baseInfo = super.getDrawInfo();
        return {
            ...baseInfo,
            character: this.character,
            nickname: this.nickname,
            abilities: this.abilitySystem.getAbilitiesInfo()
        };
    }
}