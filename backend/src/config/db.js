import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let db;

try {
    db = await mysql2.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    const connection = await db.getConnection();
    console.log('|||connexion réussie à la BDD|||');
    connection.release();

} catch (error) {
    console.error('Erreur:', error.message);
    process.exit(1);
}

export default db;