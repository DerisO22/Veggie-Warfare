import { useLightMode } from "../../contexts/game/LightContext";

export const LightConfigs = {
    mode0: {
        ambient_light_intensity: 2,
        direction_light_intensity: 0,
        point_light_intensity: 0,
        castShadow: false
    },
    mode1: {
        ambient_light_intensity: 0.4,
        direction_light_intensity: 1.5,
        point_light_intensity: 0,
        castShadow: true
    },
    mode2: {
        ambient_light_intensity: 3,
        direction_light_intensity: 0,
        point_light_intensity: 100000,
        castShadow: true
    },
}

const Lights = () => {
    const { lightMode } = useLightMode();

    const config = LightConfigs[`mode${lightMode}`] || LightConfigs.mode0;
    
    return (
        <>
            <ambientLight
                intensity={config.ambient_light_intensity}
            />
            
            {/* Fill light for daytime */}
            <directionalLight 
                position={[0, 30, -200]}
                castShadow={config.castShadow}
                intensity={config.direction_light_intensity || 0} 
                shadow-camera-left={-20}  
                shadow-camera-right={20}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
                shadow-camera-far={500}    
                shadow-mapSize={[2048, 2048]} 
                shadow-bias={0.001}
            />

            <pointLight castShadow={config.castShadow} position={[-20, 100, -20]} intensity={config.point_light_intensity || 0}/>
        </>
    )
}

export default Lights;