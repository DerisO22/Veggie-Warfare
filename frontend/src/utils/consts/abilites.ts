interface AbilityMapType {
    [key: string]: {
        ability1: string,
        ability2: string
    }
}

export const ABILITY_MAP: AbilityMapType = {
    carrot: {
        ability1: 'sprint',
        ability2: 'forward_dash'
    },
    potato: {
        ability1: 'sprint',
        ability2: 'super_jump'
    },
    cucumber: {
        ability1: 'sprint',
        ability2: 'forward_dash'
    },
    tomato: {
        ability1: 'sprint',
        ability2: 'super_jump'
    }
};