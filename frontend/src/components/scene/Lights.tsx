import { useRef, useState } from "react";
import { useLightMode } from "../../contexts/game/LightContext";
import { useHelper } from "@react-three/drei";
import { DirectionalLightHelper, Object3D } from "three";

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
        ambient_light_intensity: 0.3,
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
    const [targetObject] = useState(() => new Object3D());

    targetObject.position.set(-14, -5, 22);

    const config = LightConfigs[`mode${lightMode}`] || LightConfigs.mode0;

    //useHelper(directionalLightRef, DirectionalLightHelper, 5, 'red')
    
    return (
        <>
            <ambientLight
                intensity={config.ambient_light_intensity}
            />

            <primitive object={targetObject} />
            
            {/* Fill light for daytime */}
            <directionalLight 
                ref={directionalLightRef}
                position={[-14, 20, -30]}  
                target={targetObject}
                castShadow={config.castShadow}
                intensity={config.direction_light_intensity || 0}
                
                shadow-mapSize={[4096, 4096]}
                shadow-bias={-0.0000001}
                shadow-normalBias={.0001}
                
                shadow-camera-left={-100}  
                shadow-camera-right={100}
                shadow-camera-top={100}
                shadow-camera-bottom={-100}
                shadow-camera-far={400}
                shadow-camera-near={1}
            />

            <pointLight castShadow={config.castShadow} position={[-20, 100, -20]} intensity={config.point_light_intensity || 0}/>
        </>
    )
}

export default Lights;