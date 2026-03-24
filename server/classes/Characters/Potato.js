export class Potato {
    constructor(game, socket) {
        super(game, socket);

        this.character = "potato";
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