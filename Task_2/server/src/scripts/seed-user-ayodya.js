/**
 * One-off: ensure user "ayodya" with password "ayodyapass" exists in the database
 * (e.g. in Railway's DB so login works on the live Vercel site).
 *
 * Run from Task_2/server with Railway MySQL env vars set, same as create-workshops-table.js:
 *   $env:MYSQL_HOST="..."; $env:MYSQL_PORT="..."; $env:MYSQL_USER="root"; $env:MYSQL_PASSWORD="..."; $env:MYSQL_DATABASE="railway"; node src/scripts/seed-user-ayodya.js
 */
import bcrypt from 'bcrypt';
import { getDb } from '../db/database.js';

const USERNAME = 'ayodya';
const PASSWORD = 'ayodyapass';
const EMAIL = 'ayodyaoshadi60@gmail.com';
const FULL_NAME = 'Oshadi Ayodya';
const SALT_ROUNDS = 10;

async function main() {
  const db = getDb();
  try {
    const [rows] = await db.execute('SELECT id FROM users WHERE username = ?', [USERNAME]);
    if (rows.length > 0) {
      console.log('User "ayodya" already exists. Login should work.');
      process.exit(0);
      return;
    }
    const password_hash = await bcrypt.hash(PASSWORD, SALT_ROUNDS);
    await db.execute(
      `INSERT INTO users (username, email, password_hash, full_name, role)
       VALUES (?, ?, ?, ?, 'user')`,
      [USERNAME, EMAIL, password_hash, FULL_NAME]
    );
    console.log('User "ayodya" created. You can now login with ayodya / ayodyapass on the live site.');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
