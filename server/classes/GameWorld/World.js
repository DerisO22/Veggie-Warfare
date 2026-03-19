import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import { NodeIO } from '@gltf-transform/core';
import { KHRDracoMeshCompression } from '@gltf-transform/extensions';
import * as draco3d from 'draco3d';
import path from "path";

export class World {
    constructor(world) {
        this.world = world;

        this.map_paths = {
            map1: "./assets/low_poly_environment_compressed-v1.glb",
            map2: "./assets/low_poly_environment_compressed-v1(1).glb",
            map3: "./assets/low_poly_environment_compressed-v1(2).glb",
        }
    }

    /**
     * Handle Map Path
     */
    getMapPath(map_winner) {
        return this.map_paths[map_winner];
    }

    /**
     *  This will adapt to any model we give it
     */
    async initWorldPhysics(map_winner) {
        const glbPath = path.resolve(`${this.getMapPath(map_winner)}`);
    
        const io = new NodeIO()
            .registerExtensions([KHRDracoMeshCompression])
            .registerDependencies({
                'draco3d.decoder': await draco3d.createDecoderModule(),
            });
    
        const document = await io.read(glbPath);
        const root = document.getRoot();
    
        // Build a parent lookup map so we can walk up the hierarchy
        const parentMap = new Map();
        root.listNodes().forEach(node => {
            node.listChildren().forEach(child => parentMap.set(child, node));
        });
    
        // Accumulate world transform by walking up to root
        const getWorldMatrix = (node) => {
            const t = node.getTranslation();
            const r = node.getRotation();
            const s = node.getScale();
    
            const localMat = new THREE.Matrix4().compose(
                new THREE.Vector3(...t),
                new THREE.Quaternion(r[0], r[1], r[2], r[3]),
                new THREE.Vector3(...s)
            );
    
            const parent = parentMap.get(node);
            if (parent) {
                return getWorldMatrix(parent).multiply(localMat);
            }
            return localMat;
        };
    
        // Scene transform matching Landscape.tsx
        const sceneMatrix = new THREE.Matrix4().compose(
            new THREE.Vector3(-14, -5, -42),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0)),
            new THREE.Vector3(2, 2, 2)
        );
    
        root.listNodes().forEach(node => {
            const mesh = node.getMesh();
            if (!mesh) return;
    
            // Combine internal node world transform with our scene transform
            const combinedMatrix = sceneMatrix.clone().multiply(getWorldMatrix(node));
    
            mesh.listPrimitives().forEach(primitive => {
                const vertices = primitive.getAttribute('POSITION').getArray();
                const indices = primitive.getIndices()?.getArray();
    
                if (!vertices) return;
    
                const transformedVertices = new Float32Array(vertices.length);
                for (let i = 0; i < vertices.length; i += 3) {
                    const vec = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
                    vec.applyMatrix4(combinedMatrix);
                    transformedVertices[i]     = vec.x;
                    transformedVertices[i + 1] = vec.y;
                    transformedVertices[i + 2] = vec.z;
                }
    
                const bodyDesc = RAPIER.RigidBodyDesc.fixed();
                const body = this.world.createRigidBody(bodyDesc);
                const colliderDesc = RAPIER.ColliderDesc.trimesh(
                    transformedVertices,
                    indices ? new Uint32Array(indices) : null
                );
                this.world.createCollider(colliderDesc, body);
            });
        });
    }
}