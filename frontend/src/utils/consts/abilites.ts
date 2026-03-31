export interface AbilityMapType {
    [key: string]: {
        ability1: string,
        ability2: string
    }
}

export interface CharacterAbilities {
    ability1: string,
    ability2: string
}

export const ABILITY_MAP: AbilityMapType = {
    carrot: {
        ability1: 'forward_dash',
        ability2: 'sprint'
    },
    potato: {
        ability1: 'super_jump',
        ability2: 'sprint'
    },
    cucumber: {
        ability1: 'super_jump',
        ability2: 'sprint'
    },
    tomato: {
        ability1: 'super_jump',
        ability2: 'sprint'
    }
};