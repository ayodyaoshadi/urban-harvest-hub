/**
 * One-off script: create the workshops table in MySQL.
 * Run from Task_2/server with Railway MySQL env vars set:
 *
 *   Windows (PowerShell):
 *   $env:MYSQL_HOST="metro.proxy.rlwy.net"; $env:MYSQL_PORT="46448"; $env:MYSQL_USER="root"; $env:MYSQL_PASSWORD="YOUR_PASSWORD"; $env:MYSQL_DATABASE="railway"; node src/scripts/create-workshops-table.js
 *
 *   Or set vars in a .env file and run (if you use dotenv), or export on Linux/Mac.
 */
import { getDb } from '../db/database.js';

const CREATE_WORKSHOPS = `
CREATE TABLE IF NOT EXISTS workshops (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration_hours DECIMAL(4,2) DEFAULT 2.0,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50),
  max_participants INT DEFAULT 20,
  current_participants INT DEFAULT 0,
  location VARCHAR(200),
  instructor_name VARCHAR(100),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
`.trim();

async function main() {
  const db = getDb();
  try {
    await db.execute(CREATE_WORKSHOPS);
    console.log('Workshops table created (or already existed).');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
