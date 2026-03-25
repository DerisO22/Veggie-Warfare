import { Player } from "../Player.js";
import { SprintAbility } from "./CharacterAbilities/abilities/SprintAbility.js";
import { AbilitySystem } from "./CharacterAbilities/AbilitySystem.js";

export class Potato extends Player {
    constructor(game, socket) {
        super(game, socket, { x: .8, y: .8, z: .8 });

        this.character = "potato";
        this.characterColor = 0xF4ECB5;
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