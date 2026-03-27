global.self = global;
import RAPIER from "@dimforge/rapier3d-compat";
import { World } from "./GameWorld/World.js";
import { GameState } from "./GameState.js";
import { Lobby } from "./Lobby.js";
import { CharacterFactory } from "./Characters/CharacterFactory.js";
import { RateLimiter } from "../utils/RateLimiter.js";
import { InputValidator } from "../utils/InputValidator.js";

const GRAVITY_CONST = -18.81;
const NEEDED_PLAYERS = 1;

export class Game {
    constructor(io) {
        this.io = io;
        this.players = {};
        this.world = null;
        this.pending_sockets = {}; 
        this.GameState = new GameState(io);
        this.Lobby = new Lobby(io);
        this.is_game_running = false;

        /**
         * Rate Limiters for Socket Listeners
         */
        //          Chat - 03 messages/second
        // Button inputs - 25 presses/second
        // ability usage - 10 per second
        this.chatRateLimit = new RateLimiter(3, 1000);
        this.buttonRateLimit = new RateLimiter(25, 1000);
        this.abilityRateLimit = new RateLimiter(10, 1000);
    }

    async startGame() {
        try {
            this.setupSocketEvents();
            console.log("Socket events registered, waiting for clients...");
            
            await this.lobbyWait();
            
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

    async lobbyWait() {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                const isEnoughPlayer = Object.keys(this.pending_sockets).length >= NEEDED_PLAYERS ? true : false;
                console.log(isEnoughPlayer)
                console.log(Object.keys(this.pending_sockets).length);

                if (isEnoughPlayer) {
                    console.log("Yes Enough. Start the Voting");
                    clearInterval(interval);
                    resolve();
                } else {
                    console.log("Waiting for Players");
                    console.log("will check again in 5sec");
                }
            }, 5000);
        });
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
                    // Add character selection
                    const select_character = socket.selectedCharacter || "carrot"

                    this.players[socketId] = CharacterFactory.createCharacter(select_character, this, socket);
                    console.log(`Player created for pending socket ${socketId} with character ${select_character}`);
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

            socket.emit("available_characters", {
                characters: CharacterFactory.getAvailableCharacters(),
                characterInfo: this.getCharacterSelectionInfo()
            })
            
            socket.on("select_character", ({ character }) => {
                this.handleCharacterSelection(socket, character);
            })

            // Lobby vote
            this.Lobby.setUpVotingSockets(socket);
            
            if (this.world) {
                try {
                    console.log(`World ready, waiting for character selection from ${socket.id}`);
                } catch (error) {
                    console.error(`Failed to create player for ${socket.id}:`, error);
                }
            } else {
                console.log(`World not ready, deferring player creation for ${socket.id}`);
                this.pending_sockets = this.pending_sockets || {};
                this.pending_sockets[socket.id] = socket;

                // Lobby menu UI info
                // Pending Player Count
                // Probably Player Profiles (After feature to edit usernames in lobby gets implemented)
                this.io.sockets.emit("lobby_info", { total_players: Object.keys(this.pending_sockets).length, pending_socket_ids: Object.keys(this.pending_sockets) });
            }

            socket.on("disconnect", (reason) => {
                const player = this.players[socket.id];
                console.log(`Player disconnected: ${socket.id}`);

                this.io.sockets.emit("message", `Player at socket ${socket.id} has disconnected`);
                
                // Lobby menu UI info
                // Pending Player Count
                // Probably Player Profiles (After feature to edit usernames in lobby gets implemented)
                this.io.sockets.emit("lobby_info", { total_players: Object.keys(this.pending_sockets).length, pending_socket_ids: Object.keys(this.pending_sockets) });

                if (player && this.world) {
                    this.world.removeRigidBody(player.body);
                    delete this.players[socket.id];
                }
                
                // Clean up from pending sockets 
                if (this.pending_sockets && this.pending_sockets[socket.id]) {
                    delete this.pending_sockets[socket.id];
                    console.log(`Removed pending socket ${socket.id}`);
                }

                // clean up ratelimits
                delete this.chatRateLimit.requests[socket.id];
                delete this.buttonRateLimit.requests[socket.id];
                delete this.abilityRateLimit.requests[socket.id];
            });

            socket.on("setButton", ({ button, value }) => {
                // input val
                const validation = InputValidator.validateButton(button, value);
                if(!validation.valid) {
                    console.warn(`Button validation failed: ${validation.error}`);
                    return;
                }

                // rate limit
                if(!this.buttonRateLimit.isAllowed(socket.id)){
                    console.log("Hit button rate limit!");
                    return;
                }

                let player = this.players[socket.id];

                if (player) {
                    player.setButton(button, value);
                }
            });

            socket.on("use_ability", ({ abilityKey, params }) => {
                const player = this.players[socket.id];
                if (!player) return;
            
                // Validate ability key
                const validation = InputValidator.validateAbilityKey(abilityKey, player);
                if (!validation.valid) {
                    console.warn(`Ability validation failed: ${validation.error}`);
                    socket.emit("error", validation.error);
                    return;
                }

                // Verify cooldown
                // const ability = player.abilitySystem.abilities[abilityKey];
                // const cooldownCheck = InputValidator.verifyCooldown(ability);
                // if (!cooldownCheck.valid) {
                //     socket.emit("error", cooldownCheck.error);
                //     return;
                // }
            
                // Rate limit
                if(!this.abilityRateLimit.isAllowed(socket.id)){
                    return;
                }

                if(player && player.abilitySystem) {
                    player.abilitySystem.useAbility(abilityKey, params);
                }
            })

            socket.on("send_message", ({ text }) => {
                // check message
                const validation = InputValidator.validateChatMessage(text);
                if (!validation.valid) {
                    console.warn(`Message validation failed: ${validation.error}`);
                    socket.emit("error", validation.error);
                    return;
                }

                // rate limit
                if(!this.chatRateLimit.isAllowed(socket.id)){
                    console.log("Hit chatting rate limit!");
                    return;
                }

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

    /**
     * Character Selection Methods
     */
    getCharacterSelectionInfo() {
        const characters = CharacterFactory.getAvailableCharacters();

        const info = {};

        characters.forEach(character => {
            info[character] = CharacterFactory.getCharacterInfo(character);
        })

        return info;
    }

    handleCharacterSelection(socket, characterType) {
        console.log(`Player ${socket.id} selected character: ${characterType}`);
 
        // Validate character type
        if (!CharacterFactory.CHARACTERS[characterType.toLowerCase()]) {
            console.warn(`Invalid character type: ${characterType}`);
            socket.emit("selection_error", "Invalid character selected");
            return;
        }

        if(this.world){
            try {
                this.players[socket.id] = CharacterFactory.createCharacter(characterType, this, socket);
                socket.emit("character_selected", { character: characterType });
                console.log(`Character ${characterType} created for ${socket.id}`);
            } catch (error) {
                console.error(`Failed to create character for ${socket.id}:`, error);
                socket.emit("selection_error", "Failed to create character");
            }
        } else {
            this.pending_sockets[socket.id].selectedCharacter = characterType;
            socket.emit("character_selected", { character: characterType });
            console.log(`Character selection stored for pending socket ${socket.id}`);
        }
    }
}