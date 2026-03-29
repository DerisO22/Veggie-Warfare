import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

export const PG_PROD_CONFIG = {
    host: process.env.PGHOST,
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    user: process.env.PGUSER,
    max: 24,
    idleTimeoutMillis: 500000,
}

// Just railway. No need to use local PG database on pg client
export const createClient = () => {
    return new pg.Client({
        connectionString: process.env.DATABASE_PUBLIC_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
}