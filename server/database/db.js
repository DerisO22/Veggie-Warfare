import path from 'path';
import pg from 'pg';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, "db.sql");

async function initializeDatabase(client) {
    try {
        await client.connect();

        console.log("Connected to database successfully");

        const sqlScript = fs.readFileSync(dbPath, "utf-8");
        await client.query(sqlScript);

        console.log("Database schema initialized successfully");
    } catch (err) {
        console.error("Error initializing database");
        throw err;
    } 
}

export default initializeDatabase;