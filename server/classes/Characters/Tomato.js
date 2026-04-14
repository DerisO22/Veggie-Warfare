import { Player } from "../Player.js";
import { GroundPound } from "./CharacterAbilities/abilities/GroundPound.js";
import { SprintAbility } from "./CharacterAbilities/abilities/SprintAbility.js";
import { SuperJumpAbility } from "./CharacterAbilities/abilities/SuperJumpAbilitiy.js";
import { AbilitySystem } from "./CharacterAbilities/AbilitySystem.js";

export class Tomato extends Player {
    constructor(game, socket) {
        super(game, socket, { x: 1, y: 1, z: 1 });

        this.character = "tomato";
        this.characterColor = 0xFF6347;
        this.abilitySystem = new AbilitySystem(this);
        this.abilitySystem.addAbility("sprint", new SprintAbility());
        this.abilitySystem.addAbility("super_jump", new SuperJumpAbility());
        this.abilitySystem.addAbility("ground_pound", new GroundPound());
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