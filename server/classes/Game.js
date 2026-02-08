import { Player } from "./Player.js";

export class Game {
    constructor(io) {
        this.io = io;
        this.players = {};

        this.io.on("connection", (socket) => {
            io.sockets.emit("message", `player at socket ${socket.id} has connected.`);
            this.players[socket.id] = new Player(this, socket);

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

            socket.on("send_message", ({ text }) => {
                let player = this.players[socket.id];

                if (player) {
                    player.sendMessage(text);
                }
            });
        });
    }

    update() {
        Object.values(this.players).forEach((player) => {
            if (player) player.update();
        });
    }

    getGameState() {
        let players = Object.entries(this.players).map(([id, player]) => {
            return {
                id: id,
                ...player.getDrawInfo(),
                ...player.chat.getPlayerChats(),
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