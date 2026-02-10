import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const poolConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'urban_harvest_hub',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};
// Cloud MySQL (e.g. PlanetScale) often requires SSL
if (process.env.MYSQL_SSL === 'true') {
  poolConfig.ssl = { rejectUnauthorized: true };
}
const pool = mysql.createPool(poolConfig);

/**
 * Get the MySQL connection pool (promise API).
 * Use: const [rows] = await db.execute(sql, params);
 * For INSERT: result[0].insertId; for UPDATE/DELETE: result[0].affectedRows
 */
export function getDb() {
  return pool;
}

/**
 * Initialize schema: ensure DB exists and run CREATE TABLE IF NOT EXISTS.
 */
export async function initSchema() {
  const schemaPath = path.join(__dirname, 'schema-mysql.sql');
  const sql = readFileSync(schemaPath, 'utf8');
  const statements = sql
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.startsWith('CREATE TABLE'));
  for (const stmt of statements) {
    await pool.execute(stmt + ';');
  }
}
