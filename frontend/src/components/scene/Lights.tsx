import { useRef } from "react";
import { useLightMode } from "../../contexts/game/LightContext";
import { useHelper } from "@react-three/drei";
import { DirectionalLightHelper } from "three";

export interface LightConfigsType {
    [key: string]: {
        ambient_light_intensity: number,
        direction_light_intensity: number,
        point_light_intensity: number,
        castShadow: boolean
    }
}

export const LightConfigs: LightConfigsType = {
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
    const directionalLightRef = useRef(null);

    const config = LightConfigs[`mode${lightMode}`] || LightConfigs.mode0;

    useHelper(directionalLightRef, DirectionalLightHelper, 5, 'red')
    
    return (
        <>
            <ambientLight
                intensity={config.ambient_light_intensity}
            />
            
            {/* Fill light for daytime */}
            <directionalLight 
                ref={directionalLightRef}
                position={[0, 10, -30]}
                castShadow={config.castShadow}
                intensity={config.direction_light_intensity || 0} 
                shadow-camera-left={-100}  
                shadow-camera-right={100}
                shadow-camera-top={100}
                shadow-camera-bottom={-100}
                shadow-camera-far={300}    
                shadow-mapSize={[2048, 2048]}
            />

            <pointLight castShadow={config.castShadow} position={[-20, 100, -20]} intensity={config.point_light_intensity || 0}/>
        </>
    )
}

export default Lights;