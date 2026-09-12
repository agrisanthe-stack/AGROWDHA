import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import { config } from '../server/config/environment';

if (!config.database.url) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure SSL for NeonDB connections
const sslConfig = config.database.url.includes('neon.tech') 
  ? { rejectUnauthorized: false } 
  : false;

// Create database connection pool
const pool = new Pool({ 
  connectionString: config.database.url,
  ssl: sslConfig
});

// Create Drizzle instance
const db = drizzle(pool, { schema });

export { pool, db };