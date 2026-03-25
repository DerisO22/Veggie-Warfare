import { Player } from "../Player.js";
import { SprintAbility } from "./CharacterAbilities/abilities/SprintAbility.js";
import { AbilitySystem } from "./CharacterAbilities/AbilitySystem.js";

export class Carrot extends Player {
    constructor(game, socket) {
        // the {x, y, z} is this character base move speed!!
        super(game, socket, { x: 1.3, y: 1.3, z: 1.3 });

        this.character = "carrot";
        this.characterColor = 0xff9800;

        this.abilitySystem = new AbilitySystem(this);
        this.abilitySystem.addAbility("sprint", new SprintAbility());
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