import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";

export interface CharacterModelPathsType {
    [key: string]: string;
}

const characterModelPaths: CharacterModelPathsType = {
    carrot: "/carrot.glb",
    cucumber: "/cucumber.glb",
    potato: "/potato.glb",
    tomato: "/tomato.glb"
}

const Character = ({ modelType }: { modelType: string }) => {
    const path = characterModelPaths[modelType] || characterModelPaths.carrot;
    const { scene } = useGLTF(path);

    const clonedScene = useMemo(() => {
        const clone = SkeletonUtils.clone(scene);
        clone.traverse((child) => {
            if ((child as any).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                if ((child as any).material) {
                    (child as any).material = (child as any).material.clone();
                }
            }
        });
        return clone;
    }, [scene]);

    return (
        <primitive object={clonedScene} />
    )
};

// Preload all character models
Object.values(characterModelPaths).forEach(path => {
    useGLTF.preload(path);
});

export default Character;