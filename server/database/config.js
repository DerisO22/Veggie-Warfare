import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

// Just railway. No need to use local PG database on pg client
export const createClient = () => {
    return new pg.Client({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
}