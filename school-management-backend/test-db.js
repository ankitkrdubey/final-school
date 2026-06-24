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
        console.log('Testing student fetch...');
        const [rows] = await pool.query('SELECT * FROM students');
        console.log('Existing students in DB:', rows.length);

        console.log('Testing student insert...');
        const testStudent = {
            student_id: 'TEST' + Math.floor(Math.random() * 1000),
            name: 'Test Student',
            email: 'test@example.com',
            phone: '1234567890',
            class_id: 10,
            sectionId: 3,
            dob: '2010-01-01',
            gender: 'Male',
            address: 'Test Address',
            blood_group: 'O+',
            admission_date: '2026-01-01',
            avatar: null
        };

        await pool.query(
            'INSERT INTO students (student_id, name, email, phone, class_id, section_id, dob, gender, address, blood_group, admission_date, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                testStudent.student_id,
                testStudent.name,
                testStudent.email,
                testStudent.phone,
                testStudent.class_id,
                testStudent.sectionId,
                testStudent.dob,
                testStudent.gender,
                testStudent.address,
                testStudent.blood_group,
                testStudent.admission_date,
                testStudent.avatar
            ]
        );
        console.log('Insert successful!');
        
        // clean up
        await pool.query('DELETE FROM students WHERE student_id = ?', [testStudent.student_id]);
        console.log('Cleanup successful!');
    } catch (err) {
        console.error('Error during test:', err);
    } finally {
        await pool.end();
    }
}

run();
