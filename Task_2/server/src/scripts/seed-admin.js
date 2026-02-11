/**
 * One-off: ensure an admin user exists for Postman/API testing.
 * Creates user "admin" / "adminpass" with role "admin" (or updates existing "admin" to role admin).
 *
 * Run from Task_2/server with same MYSQL_* env vars as your API (e.g. Railway):
 *   $env:MYSQL_HOST="..."; $env:MYSQL_PORT="..."; $env:MYSQL_USER="root"; $env:MYSQL_PASSWORD="..."; $env:MYSQL_DATABASE="railway"; node src/scripts/seed-admin.js
 */
import bcrypt from 'bcrypt';
import { getDb } from '../db/database.js';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'adminpass';
const ADMIN_EMAIL = 'adminurbanharvest@gmail.com';
const ADMIN_FULL_NAME = 'Admin User';
const SALT_ROUNDS = 10;

async function main() {
  const db = getDb();
  try {
    const [rows] = await db.execute('SELECT id, role FROM users WHERE username = ?', [ADMIN_USERNAME]);
    if (rows.length > 0) {
      await db.execute("UPDATE users SET role = 'admin' WHERE username = ?", [ADMIN_USERNAME]);
      console.log('User "admin" updated to role admin. Login with admin / adminpass.');
    } else {
      const password_hash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
      await db.execute(
        `INSERT INTO users (username, email, password_hash, full_name, role)
         VALUES (?, ?, ?, ?, 'admin')`,
        [ADMIN_USERNAME, ADMIN_EMAIL, password_hash, ADMIN_FULL_NAME]
      );
      console.log('Admin user created. Login with admin / adminpass.');
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
