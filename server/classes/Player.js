export class Player {
    constructor(game, io){
        this.game = game;
        this.io = io;
        this.position = {x: 0, y: 0, z: 0};
        this.movespeed = {x: 0.1, y: 0.1, z: 0.1};
        this.input = {};
    }

    update() {
        // Movement
        let xInput = 0;
        if (this.input.left) xInput--;
        if (this.input.right) xInput++;

        let yInput = 0;
        if (this.input.up) yInput--;
        if (this.input.down) yInput++;


        this.position.x += xInput * this.movespeed.x;
        this.position.y += yInput * this.movespeed.y;
    }

    setButton(button, value) {
        this.input[button] = value;
    }

    getDrawInfo() {
        return {
            position: this.position,
        }
    }
}