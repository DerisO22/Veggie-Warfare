export class MovementModifierSystem {
    constructor(baseMoveSpeed) {
        this.baseMoveSpeed = { ...baseMoveSpeed };
        this.modifiers = new Map();
    }

    applyModifier(key, multiplier, source, duration = null) {
        const modifier = {
            key,
            multiplier,
            source,
            duration,
            startTime: duration ? Date.now() : null
        }

        this.modifiers.set(key, modifier);
    }

    removeModifier(key) {
        this.modifiers.delete(key);
    }

    getMovementMultiplier() {
        let multiplier = 1.0;

        for(const mod of this.modifiers.values()) {
            multiplier *= mod.multiplier;
        }

        return multiplier;
    }

    getAdjustedMovespeed() {
        const mult = this.getMovementMultiplier();

        return {
            x: this.baseMoveSpeed.x * mult,
            y: this.baseMoveSpeed.y * mult,
            z: this.baseMoveSpeed.z * mult
        }
    }

    hasModifier(key) {
        return this.modifiers.has(key);
    }

    update() {
        const now = Date.now();
        const toRemove = [];
     
        for (const [key, mod] of this.modifiers.entries()) {
            if (mod.duration && mod.startTime) {
                if (now - mod.startTime >= mod.duration) {
                    toRemove.push(key);
                }
            }
        }
     
        toRemove.forEach(key => this.removeModifier(key));
    }

    getModifiers() {
        return Array.from(this.modifiers.values());
    }

    getDebugInfo() {
        return {
            baseMovespeed: this.baseMoveSpeed,
            currentMultiplier: this.getMovementMultiplier(),
            adjustedMovespeed: this.getAdjustedMovespeed(),
            activeModifiers: this.getModifiers(),
        };
    }

    reset() {
        this.modifiers.clear();
    }
}