import db from './src/config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sql = fs.readFileSync(path.join(__dirname, './src/config/task.sql'), 'utf8');

const connection = await mysql.createConnection({
    
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  multipleStatements: true
});

try {
     await connection.query('USE railway');
  await connection.query(sql);
  console.log(' Base de données importée !');
} catch (error) {
  console.error(' Erreur :', error.message);
} finally {
  await connection.end();
  process.exit();
}