import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "❌ DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Check if DATABASE_URL is just a placeholder
if (process.env.DATABASE_URL.includes('your_username') || 
    process.env.DATABASE_URL.includes('your_password')) {
  throw new Error(
    "❌ DATABASE_URL is not configured properly. Please update the DATABASE_URL in your .env file with valid database credentials.",
  );
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const db = drizzle(pool, { schema });
