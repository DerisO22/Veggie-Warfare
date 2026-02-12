import GameWorld from "./GameWorld"
import Landscape from "./Landscape"

interface SceneProps {
    cameraMode: 'follow' | 'orbit',
}

const Scene = ({ cameraMode }: SceneProps) => {
    return (
        <>
            <GameWorld cameraMode={cameraMode}/>
            <Landscape />
        </>
    )
}

export default Scene
