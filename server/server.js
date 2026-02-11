import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import { Game } from './classes/Game.js';

const PORT = process.env.PORT || 3001;
const FRAME_TIME = Math.floor(1000 / 60);

const app = express();
const server = http.Server(app);
const io = new Server(server, { 
    pingInterval: 1000,
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});
const game = new Game(io);

app.set('port', PORT);

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

setInterval(() => {
    if (game) {
        game.update();
        game.sendState();
    }
}, FRAME_TIME);

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})