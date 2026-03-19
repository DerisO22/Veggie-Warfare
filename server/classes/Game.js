global.self = global;
import RAPIER from "@dimforge/rapier3d-compat";
import { Player } from "./Player.js";
import { World } from "./GameWorld/World.js";
import { GameState } from "./GameState.js";
import { Lobby } from "./GameWorld/Lobby.js";

const GRAVITY_CONST = -18.81;

export class Game {
    constructor(io) {
        this.io = io;
        this.players = {};
        this.world = null;
        this.pending_sockets = {}; 
        this.GameState = new GameState(io);
        this.Lobby = new Lobby(io);
        this.is_game_running = false;
    }

    async startGame() {
        try {
            this.setupSocketEvents();
            
            console.log("Socket events registered, waiting for clients...");
            
            const map_winner = await this.Lobby.startVoting();
            console.log(`Map ${map_winner} won the vote`);

            await this.initPhysics(map_winner);
            
            this.is_game_running = true;
            console.log("Game loop started!");
        } catch (error) {
            console.error("Error starting game:", error);
            throw error;
        }
    }

    async initPhysics(map_winner) {
        await RAPIER.init();
        this.world = new RAPIER.World({ x: 0.0, y: GRAVITY_CONST, z: 0 });

        const gameWorld = new World(this.world);
        await gameWorld.initWorldPhysics(map_winner);

        console.log("Physics Loaded via gltf-transform");
        
        // Create Player instances for anyone connects during voting
        if (this.pending_sockets) {
            console.log(`Creating ${Object.keys(this.pending_sockets).length} pending players...`);
            for (const [socketId, socket] of Object.entries(this.pending_sockets)) {
                try {
                    this.players[socketId] = new Player(this, socket);
                    console.log(`Player created for pending socket ${socketId}`);
                } catch (error) {
                    console.error(`Failed to create player for ${socketId}:`, error);
                }
            }
            this.pending_sockets = {};
        }
    }

    setupSocketEvents() {
        this.io.on("connection", (socket) => {
            console.log(`Socket connected: ${socket.id}`);
            this.io.sockets.emit("message", `player at socket ${socket.id} has connected.`);
            
            if (this.world) {
                try {
                    this.players[socket.id] = new Player(this, socket);
                    console.log(`Player created immediately for ${socket.id}`);
                } catch (error) {
                    console.error(`Failed to create player for ${socket.id}:`, error);
                }
            } else {
                console.log(`World not ready, deferring player creation for ${socket.id}`);
                this.pending_sockets = this.pending_sockets || {};
                this.pending_sockets[socket.id] = socket;
            }

            socket.on("disconnect", (reason) => {
                const player = this.players[socket.id];
                console.log(`Player disconnected: ${socket.id}`);

                this.io.sockets.emit("message", `Player at socket ${socket.id} has disconnected`);

                if (player && this.world) {
                    this.world.removeRigidBody(player.body);
                    delete this.players[socket.id];
                }
                
                // Clean up from pending sockets 
                if (this.pending_sockets && this.pending_sockets[socket.id]) {
                    delete this.pending_sockets[socket.id];
                    console.log(`Removed pending socket ${socket.id}`);
                }
            });

            socket.on("setButton", ({ button, value }) => {
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
            };
        });

        return {
            players
        };
    }

    sendState() {
        const state = this.getGameState();
        this.io.sockets.emit("sendState", state);
    }
}