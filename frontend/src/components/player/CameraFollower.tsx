import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3, Group} from "three";

interface CameraFollowerProps {
    targetRef: React.RefObject<Group>;
    rotationY?: number;
}

export function CameraFollower({ targetRef, rotationY = 0 }: CameraFollowerProps) {
    const { camera } = useThree();
    const cameraTarget = useRef(new Vector3());

    useFrame((_, delta) => {
        if (targetRef.current) {
            const { x, y, z } = targetRef.current.position;
            
            const distance = 8;
            const height = 3.5;
            
            const offsetX = Math.sin(rotationY) * distance;
            const offsetZ = Math.cos(rotationY) * distance;
            
            cameraTarget.current.set(
                x + offsetX,
                y + height,
                z + offsetZ
            );
            
            // Smooth camera movement
            camera.position.lerp(cameraTarget.current, Math.min(delta * 5, 1));
            
            camera.lookAt(x, y + 1.5, z);
        }
    });

    return null;
}