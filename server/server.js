import http from 'http';
import express from 'express'
import path from 'path';
import socketIO from 'socket.io';

import { Game } from './classes/Game';

const PORT = process.env.PORT || 3001;
const FRAME_TIME = Math.floor(1000 / 60);

const app = express();
const server = http.Server(app);
const io = socketIO(server, { pingInterval: 1000 });