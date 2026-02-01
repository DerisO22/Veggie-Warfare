import { Player } from "./Player";

export class Game {
    constructor(io) {
        this.io = io;
        this.players = {};

        this.io.on("connection", (socket) => {
            io.sockets.emit("message", `player at socket ${socket.id} has connected.`);
            this.players[socket.id] = new Player(this, socket.id);

            socket.on("disconnect", (reason) => {
                io.sockets.emit("message", `Player at socket ${socket.id} has disconnected`);
                delete this.players[socket.id];
            })

            socket.on("setButton", ({button, value}) => {
                let player = this.players[socket.id];

                if (player) {
                    player.setButton(button, value);
                }
            });
        });
    }

    update() {
        Object.values(this.players).forEach((player) => {
            if (player) player.update();
        });
    }
    
    sendState() {
        let players = Object.values(this.players).map((player) => {
            return player.getDrawInfo();
        });
        this.io.sockets.emit("sendState", {
            players: players,
        });
    }
}