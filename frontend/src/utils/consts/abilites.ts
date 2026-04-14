export interface AbilityMapType {
    [key: string]: {
        ability1: string,
        ability2: string,
        ability3: string,
    }
}

export interface CharacterAbilities {
    ability1: string,
    ability2: string,
    ability3: string
}

export const ABILITY_MAP: AbilityMapType = {
    carrot: {
        ability1: 'forward_dash',
        ability2: 'sprint',
        ability3: 'side_roll',
    },
    potato: {
        ability1: 'super_jump',
        ability2: 'sprint',
        ability3: 'ground_pound',
    },
    cucumber: {
        ability1: 'super_jump',
        ability2: 'sprint',
        ability3: 'shockwave',
    },
    tomato: {
        ability1: 'super_jump',
        ability2: 'sprint',
        ability3: 'ground_pound',
    }
};