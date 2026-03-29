import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import { Game } from './classes/Game.js';

/**
 * Database
 */
import { createClient } from './database/config.js';
import initializeDatabase from './database/db.js';
const client = createClient();
dotenv.config();

/**
 * Routers
 */
import playerRoutes from "./routes/players.js";

// config
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

app.set('port', PORT);

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use(express.json());

async function start() {
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    })

    /* Database */
    try {
        await initializeDatabase(client);
    } catch (err) {
        console.error("Failed to initialize database schema: ", err);
    }

    /* Routing */
    app.use((req, res, next) => {
        req.pgClient = client;
        next();
    })
    
    app.use('/players', playerRoutes);
    
    /* Game Stuffs */
    const game = new Game(io);
    await game.startGame();

    setInterval(() => {
        if (game) {
            game.update();
            game.sendState();
        }
    }, FRAME_TIME);
};

start();