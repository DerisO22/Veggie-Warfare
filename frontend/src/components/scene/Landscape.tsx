import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"

const Landscape = () => {
    const landscape = useGLTF("../../public/low_poly_environment_compressed-v1.glb", true, false, (loader) => {
        const dracoLoader = new DRACOLoader();

        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
        dracoLoader.setDecoderConfig({ type: 'js' });

        loader.setDRACOLoader(dracoLoader);
    });

    useEffect(() => {
        landscape.scene.traverse((child) => {
            child.receiveShadow = true;
            child.castShadow = true;
            child.matrixWorldNeedsUpdate = true;
        })
    }, [landscape]);

    return (
        <>
            <primitive 
                object={landscape.scene} 
                position={[-14, -5, -42]} 
                scale={[2, 2, 2]}
                rotation-y={Math.PI / 2}
            />
        </>
    );
}

export default Landscape;