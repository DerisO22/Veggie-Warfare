import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

useGLTF.preload("/low_poly_environment_compressed-v1.glb", "https://www.gstatic.com/draco/versioned/decoders/1.5.5/");

const Landscape = () => {
    const { scene } = useGLTF(
        "/low_poly_environment_compressed-v1.glb",
        "https://www.gstatic.com/draco/versioned/decoders/1.5.5/"
    );

    useEffect(() => {
        scene.traverse((child) => {
            child.receiveShadow = true;
            child.castShadow = true;
        });
    }, [scene]);

    return (
        <>
            <primitive 
                castShadow
                receiveShadow
                object={scene} 
                position={[-14, -5, -42]} 
                scale={[2, 2, 2]}
                rotation-y={Math.PI / 2}
            />
        </>
    );
}

export default Landscape;