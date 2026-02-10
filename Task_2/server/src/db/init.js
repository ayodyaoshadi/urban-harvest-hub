import { initSchema } from './database.js';

await initSchema();
console.log('Database schema initialized (MySQL).');
