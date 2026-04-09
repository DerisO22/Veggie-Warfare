import { PlayerChat } from "./PlayerChat.js";
import RAPIER from  "@dimforge/rapier3d-compat";
import { MovementModifierSystem } from "./systems/MovementModifierSystem.js";
import { JumpPowerModifierSystem } from "./systems/JumpModifierSystem.js";
import { DamageSystem } from "./systems/DamageSystem.js";

const wakeUp = true;

export class Player {
    constructor(game, socket, baseMoveSpeed = { x: 1, y: 1, z: 1}){
        this.game = game;
        this.socket = socket;
        this.io = socket.id;
        this.nickname = `Player_${socket.id.substring(0, 4)}`;
        
        /**
         * Current Keyboard Inputs
         */
        //     w - forward
        //     a - left
        //     s - backward
        //     d - right
        // space - jump
        this.input = {};
        this.position = {x: 0, y: 0, z: 0};
        this.rotation = 0;
        this.canJump = true;
        this.isGrounded = true;

        /**
         * Abilties and Modifiers
         */
        this.baseMoveSpeed = baseMoveSpeed;
        this.movementModifiers = new MovementModifierSystem(baseMoveSpeed);

        const baseJumpPower = 10;
        this.baseJumpPower = baseJumpPower;
        this.jumpModifiers = new JumpPowerModifierSystem(baseJumpPower);

        /**
         * Animations
         */
        // Prob going to be very similar to this.input
        this.animation = {};

        /**
         * Player Chats
         */
        this.chat = new PlayerChat(this, socket);

        /**
         * Physics Members
         */
        let bodyDesc = RAPIER.RigidBodyDesc.dynamic()
                       .setTranslation(0, 5, 0)
                       .enabledRotations(false, false, false);

        this.body = this.game.world.createRigidBody(bodyDesc);

        let colliderDesc = RAPIER.ColliderDesc.capsule(0.5, 0.5);
        this.collider = this.game.world.createCollider(colliderDesc, this.body);

        // Team & Stats
        // Will be red or blue for team
        this.team = null;
        this.kills = 0;
        this.deaths = 0;
        this.lastKillTime = null;
    
        // Damage system
        this.damageSystem = new DamageSystem(this, game);
    };

    checkGrounded() {
        const origin = this.body.translation();
        const ray = new RAPIER.Ray({ x: origin.x, y: origin.y, z: origin.z }, { x: 0, y: -1, z: 0 });
        const hit = this.game.world.castRay(ray, 0.1, true);

        return hit !== null;
    }

    handleJump() {
        if(!this.isGrounded) return;
        if(!this.canJump) return;

        const adjustedJumpPower = this.jumpModifiers.getAdjustedJumpPower();
        const jumpImpulse = { x: 0.0, y: adjustedJumpPower, z: 0.0};
        this.body.applyImpulse(jumpImpulse, wakeUp);
        this.input.jump = false;
        this.canJump = false;

        this.isGrounded = this.checkGrounded();

        setTimeout(() => {
            this.canJump = true;
        }, 1000);
    };

    update() {
        // Movement Modifiers
        this.movementModifiers.update();
        this.jumpModifiers.update();

        const adjustedMovespeed = this.movementModifiers.getAdjustedMovespeed();

        // Movement Logic
        if (this.input.left) this.rotation += 0.06;
        if (this.input.right) this.rotation -= 0.06;

        // Movement only from forward/backward
        let zInput = 0;
        if (this.input.forward) zInput = -1;
        if (this.input.backward) zInput = 1;

        const speed = adjustedMovespeed.x * 4;
        const currentVel = this.body.linvel();

        if (zInput !== 0) {
            const velX = Math.sin(this.rotation) * speed * zInput;
            const velZ = Math.cos(this.rotation) * speed * zInput;
            this.body.setLinvel({ x: velX, y: currentVel.y, z: velZ }, true);
        } else {
            this.body.setLinvel({ x: currentVel.x * 0.8, y: currentVel.y, z: currentVel.z * 0.8 }, true);
        }

        /**
         * Jumping Logic
         */
        if(this.input.jump) {
            this.handleJump()
        };

        // of the map death
        const position = this.body.translation();
        if (position.y < -50 && !this.damageSystem.isDead) {
            this.damageSystem.die(null); 
        }
    };

    setButton(button, value) {
        this.input[button] = value;
    };

    setNickname(newNickname) {
        this.nickname = newNickname;
    }

    getDrawInfo() {
        const position = this.body.translation();
        return {
            position: { 
                x: Math.round(position.x * 100) / 100, 
                y: Math.round(position.y * 100) / 100,
                z: Math.round(position.z * 100) / 100
            },
            rotation: this.rotation,
            team: this.team,
            kills: this.kills,
            deaths: this.deaths,
            health: this.damageSystem.currentHealth,
            healthPercentage: this.damageSystem.getHealthPercentage(),
            isDead: this.damageSystem.isDead,
            character: this.character,
            nickname: this.nickname
        };
    }

    sendMessage(text) {
        this.chat.handleMessage(text);
    }

    /**
     *  Movement Modifier Methods
     */
    applyMovementModifier(key, multiplier, source, duration = null) {
        this.movementModifiers.applyModifier(key, multiplier, source, duration);
    }
    
    removeMovementModifier(key) {
        this.movementModifiers.removeModifier(key);
    }
    
    hasMovementModifier(key) {
        return this.movementModifiers.hasModifier(key);
    }
    
    /**
     *  Jump Modifier Methods
     */
    applyJumpPowerModifier(key, multiplier, source, duration = null) {
        this.jumpModifiers.applyModifier(key, multiplier, source, duration);
    }
    
    removeJumpPowerModifier(key) {
        this.jumpModifiers.removeModifier(key);
    }
    
    hasJumpPowerModifier(key) {
        return this.jumpModifiers.hasModifier(key);
    }

    /**
     * Damage Methods
     */
    takeDamage(amount, damageDealer) {
        this.damageSystem.takeDamage(amount, damageDealer);
    }
    
    die(killer) {
        this.damageSystem.die(killer);
    }
    
    respawn() {
        this.damageSystem.respawn();
    }
}