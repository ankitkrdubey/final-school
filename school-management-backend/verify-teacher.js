const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'school_db',
    });

    try {
        const [rows] = await pool.query('SELECT * FROM teachers ORDER BY created_at DESC LIMIT 5');
        console.log('--- RECENT TEACHERS IN DB ---');
        console.log(rows.map(r => ({ id: r.teacher_id, name: r.name, email: r.email, created_at: r.created_at })));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await pool.end();
    }
}
run();
