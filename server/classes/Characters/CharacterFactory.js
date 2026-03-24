import { Carrot } from "./Carrot.js";

export class CharacterFactory {
    static CHARACTERS = {
        carrot: Carrot,
    }

    static createCharacter(characterType, game, socket) {
        const CharacterClass = this.CHARACTERS[characterType.toLowerCase()];

        // just default to carrot
        if(!CharacterClass) {
            return new Carrot(game, socket);
        }

        return new CharacterClass(game, socket);
    }

    static getAvailableCharacters() {
        return Object.keys(this.CHARACTERS);
    }

    static getCharacterInfo(characterType) {
        const infoMap = {
            carrot: {
                name: "carrot",
                description: "Fast and speedy. Can sprint for burst movement.",
                color: 0xff9800,
                abilities: ["Sprint"],
                playstyle: "Offense/Mobility"
            },
            cucumber: {
                name: "cucumber",
                description: "Fast and speedy. Can sprint for burst movement.",
                color: 0x67ab05,
                abilities: ["Sprint"],
                playstyle: "Offense/Mobility"
            },
            potato: {
                name: "potato",
                description: "Slow and Tanky. Can shield itself, significantly reducing damage.",
                color: 0xF4ECB5,
                abilities: ["Sprint"],
                playstyle: "Defensive"
            },
            tomato: {
                name: "tomato",
                description: "Slow and Tanky. Can shield itself, significantly reducing damage.",
                color: 0xFF6347,
                abilities: ["Sprint"],
                playstyle: "Defensive"
            }
        }

        return infoMap[characterType.toLowerCase()] || null;
    }
}