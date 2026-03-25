import { Player } from "../Player.js";
import { SprintAbility } from "./CharacterAbilities/abilities/SprintAbility.js";
import { AbilitySystem } from "./CharacterAbilities/AbilitySystem.js";

export class Tomato extends Player {
    constructor(game, socket) {
        super(game, socket);

        this.character = "tomato";
        this.characterColor = 0xFFFFFF;
        this.abilitySystem = new AbilitySystem(this);
        this.abilitySystem.addAbility("sprint", new SprintAbility())
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