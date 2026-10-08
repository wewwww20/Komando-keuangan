import { Pool } from 'pg';
const g = globalThis;
export const pool = g._pool || (g._pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === '1' ? { rejectUnauthorized: false } : false,
  max: 5,
}));
export const q = (text, params) => pool.query(text, params);
