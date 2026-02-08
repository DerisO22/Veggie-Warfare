import { PlayerChat } from "./PlayerChat";

export class Player {
    constructor(game, socket){
        this.game = game;
        this.socket = socket;
        this.io = socket.id;
        this.position = {x: 0, y: 0, z: 0};
        this.movespeed = {x: 0.1, y: 0.1, z: 0.1};
        this.nickname = `Player_${socket.id.substring(0, 4)}`;
        /**
         * Current Keyboard Inputs
         */
        // w - forward
        // a - left
        // s - backward
        // d - right
        this.input = {};

        this.chat = new PlayerChat(this, socket);
    };

    update() {
        // Movement Logic
        let xInput = 0;
        if (this.input.left) xInput--;
        if (this.input.right) xInput++;

        let zInput = 0;
        if (this.input.forward) zInput--;
        if (this.input.backward) zInput++;

        this.position.x += xInput * this.movespeed.x;
        this.position.z += zInput * this.movespeed.z;
    };

    setButton(button, value) {
        this.input[button] = value;
    };

    setNickname(newNickname) {
        this.nickname = newNickname;
    }

    getDrawInfo() {
        return {
            position: this.position,
        }
    };

    sendMessage(text) {
        this.chat.handleMessage(text);
    }
}