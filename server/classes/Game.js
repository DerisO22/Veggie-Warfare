global.self = global; 
import RAPIER from "@dimforge/rapier3d-compat";
import { Player } from "./Player.js";
import * as THREE from "three";
import { NodeIO } from '@gltf-transform/core';
import { KHRDracoMeshCompression } from '@gltf-transform/extensions';
import * as draco3d from 'draco3d';
import path from "path";

const GRAVITY_CONST = -18.81;

export class Game {
    constructor(io) {
        this.io = io;
        this.players = {};
        this.world = null;
    }

    async initPhysics() {
        await RAPIER.init();
        this.world = new RAPIER.World({ x: 0.0, y: GRAVITY_CONST, z: 0 });
    
        const glbPath = path.resolve('./assets/low_poly_environment_compressed-v1.glb');
    
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
    
        console.log("Physics Loaded via gltf-transform");
        this.setupSocketEvents();
    }
    
    setupSocketEvents() {
        this.io.on("connection", (socket) => {
            this.io.sockets.emit("message", `player at socket ${socket.id} has connected.`);
            this.players[socket.id] = new Player(this, socket);

            socket.on("disconnect", (reason) => {
                const player = this.players[socket.id];

                this.io.sockets.emit("message", `Player at socket ${socket.id} has disconnected`);

                if(player) {
                    this.world.removeRigidBody(player.body);
                    delete this.players[socket.id];
                }
            })

            socket.on("setButton", ({button, value}) => {
                let player = this.players[socket.id];

                if (player) {
                    player.setButton(button, value);
                }
            });

            socket.on("send_message", ({ text }) => {
                let player = this.players[socket.id];

                if (player) {
                    player.sendMessage(text);
                }
            });
        });
    }

    update() {
        if (!this.world) return;

        this.world.step();

        Object.values(this.players).forEach((player) => {
            if (player) player.update();
        });
    }

    getGameState() {
        let players = Object.entries(this.players).map(([id, player]) => {
            return {
                id: id,
                ...player.getDrawInfo(),
            }
        })

        return {
            players
        }
    }
    
    sendState() {
        const state = this.getGameState();
        this.io.sockets.emit("sendState", state);
    }
}