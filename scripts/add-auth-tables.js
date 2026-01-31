require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function migrate() {
    const host = process.env.MYSQL_HOST || 'localhost';
    const user = process.env.MYSQL_USER || 'root';
    const password = process.env.MYSQL_PASSWORD;
    const database = process.env.MYSQL_DATABASE || 'cert_db';

    try {
        const db = await mysql.createConnection({ host, user, password, database });
        console.log('✅ Connected to database for auth migration.');

        console.log('⏳ Creating users table for auth...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(36) PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('admin', 'user') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('⏳ Syncing profiles with users...');
        // Ensure profiles table exists or update it if needed
        // Assuming profiles table already exists based on migrate-db.js
        try {
            await db.query(`ALTER TABLE profiles ADD COLUMN user_id VARCHAR(36) AFTER id`);
            await db.query(`ALTER TABLE profiles ADD CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`);
        } catch (e) { console.log('   (Profiles user_id already exists or error)'); }

        console.log('✅ Auth migration complete!');
        await db.end();
        process.exit(0);
    } catch (err) {
        console.error('❌ Auth migration failed:', err.message);
        process.exit(1);
    }
}

migrate();
