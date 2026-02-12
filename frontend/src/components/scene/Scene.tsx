import GameWorld from "./GameWorld"
import Landscape from "./Landscape"

interface SceneProps {
    cameraMode: 'follow' | 'orbit',
}

const Scene = ({ cameraMode }: SceneProps) => {
    return (
        <>
            <GameWorld />
            <Landscape />
        </>
    )
}

export default Scene
