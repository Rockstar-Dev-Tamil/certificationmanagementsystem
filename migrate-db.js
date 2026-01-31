require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function migrate() {
    const host = process.env.MYSQL_HOST || 'localhost';
    const user = process.env.MYSQL_USER || 'root';
    const password = process.env.MYSQL_PASSWORD;
    const database = process.env.MYSQL_DATABASE || 'cert_db';

    try {
        const db = await mysql.createConnection({ host, user, password, database });
        console.log('✅ Connected to database for migration.');

        console.log('⏳ Adding role to profiles...');
        try {
            await db.query(`ALTER TABLE profiles ADD COLUMN role ENUM('admin', 'issuer', 'auditor', 'user') DEFAULT 'user' AFTER email`);
        } catch (e) { console.log('   (Profiles role already exists or error)'); }

        console.log('⏳ Creating institutions table...');
        await db.query(`
      CREATE TABLE IF NOT EXISTS institutions (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        domain VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        console.log('⏳ Updating templates table...');
        try {
            await db.query(`ALTER TABLE templates ADD COLUMN institution_id VARCHAR(36) AFTER id`);
            await db.query(`ALTER TABLE templates ADD CONSTRAINT fk_template_institution FOREIGN KEY (institution_id) REFERENCES institutions(id)`);
        } catch (e) { console.log('   (Templates update error or already done)'); }

        console.log('⏳ Updating certificates table...');
        try {
            await db.query(`ALTER TABLE certificates ADD COLUMN institution_id VARCHAR(36) AFTER template_id`);
            await db.query(`ALTER TABLE certificates ADD COLUMN data_hash VARCHAR(64) AFTER qr_code`);
            await db.query(`ALTER TABLE certificates ADD COLUMN revocation_reason TEXT AFTER status`);
            await db.query(`ALTER TABLE certificates ADD CONSTRAINT fk_cert_institution FOREIGN KEY (institution_id) REFERENCES institutions(id)`);
        } catch (e) { console.log('   (Certificates update error or already done)'); }

        console.log('⏳ Creating audit_logs table...');
        await db.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        action VARCHAR(255) NOT NULL,
        performed_by VARCHAR(36),
        target_id VARCHAR(36),
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (performed_by) REFERENCES profiles(id)
      )
    `);

        console.log('✅ Migration complete!');
        await db.end();
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();
