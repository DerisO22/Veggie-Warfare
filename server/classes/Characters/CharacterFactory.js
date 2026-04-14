import { Carrot } from "./Carrot.js";
import { Cucumber } from "./Cucumber.js";
import { Potato } from "./Potato.js";
import { Tomato } from "./Tomato.js";

export class CharacterFactory {
    static CHARACTERS = {
        carrot: Carrot,
        cucumber: Cucumber,
        potato: Potato,
        tomato: Tomato
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
                abilities: ["Sprint", "Forward Dash", "Side Roll"],
                playstyle: "Offense/Mobility"
            },
            cucumber: {
                name: "cucumber",
                description: "Agile and Has Hops. Can super jump for burst vertical movement.",
                color: 0x67ab05,
                abilities: ["Sprint", "Super Jump", "Shockwave"],
                playstyle: "Mobility/Support"
            },
            potato: {
                name: "potato",
                description: "Slow and Tanky. Can shield itself, significantly reducing damage.",
                color: 0xF4ECB5,
                abilities: ["Sprint", "Forward Dash", "Ground Pound"],
                playstyle: "Defensive"
            },
            tomato: {
                name: "tomato",
                description: "Slow and Tanky. Can shield itself, significantly reducing damage.",
                color: 0xFF6347,
                abilities: ["Sprint", "Super Jump", "Ground Pound"],
                playstyle: "Defensive"
            }
        }

        return infoMap[characterType.toLowerCase()] || null;
    }
}