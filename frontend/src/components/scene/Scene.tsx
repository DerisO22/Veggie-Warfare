import GameWorld from "./GameWorld"
import Landscape from "./Landscape"
import Lights from "./Lights";

interface SceneProps {
    cameraMode: 'follow' | 'orbit',
}

const Scene = ({ cameraMode }: SceneProps) => {
    return (
        <>
            <GameWorld cameraMode={cameraMode}/>
            <Landscape />
            <Lights />
        </>
    )
}

export default Scene;