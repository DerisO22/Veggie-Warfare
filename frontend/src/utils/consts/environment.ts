// probably just dark for now or could toggle randomly for each map
export const SKY_CONFIG = {
    dark: {
        sunPosition: [0, -1, 0],
        inclination: 0,
        azimuth: 0.25,
        mieCoefficient: 0.01,
        mieDirectionalG: 0.8,
        rayleigh: 0.1,
        turbidity: 300
    },
    light: {
        sunPosition: [25, -1, -20],
        inclination: 0,
        azimuth: 0.25,
        mieCoefficient: 0.015,
        mieDirectionalG: 0.1,
        rayleigh: .09,
        turbidity: -0.1
    }
}