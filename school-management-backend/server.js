const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const jwt = require('jwt-simple');
require('dotenv').config();
const initDb = require('./config/dbInit');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const secret = process.env.JWT_SECRET || 'supersecret';

// API Health Check / Root
app.get('/', (req, res) => {
    res.send('<div style="font-family: sans-serif; text-align: center; padding: 100px;"><h1>🚀 EduPro Legendary API is Live</h1><p>Visit <b>http://localhost:5173</b> to access the Frontend Portal.</p></div>');
});

// Database Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'school_db',
    waitForConnections: true,
    connectionLimit: 10
});

// Auth Routes
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`🔑 Login Attempt: ${email}`);
    try {
        // Direct match for demo and registered users
        const [users] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        
        if (users.length > 0) {
            const user = users[0];
            const token = jwt.encode({ id: user.id, role: user.role }, secret);
            console.log(`✅ Login Success: ${user.name} (${user.role})`);
            res.json({ token, role: user.role, userId: user.id, name: user.name });
        } else {
            console.warn(`❌ Login Failed: ${email}`);
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) { 
        console.error('🔥 Login Error:', err);
        res.status(500).json(err); 
    }
});

app.post('/api/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, password, role]);
        res.json({ message: 'User registered' });
    } catch (err) { res.status(500).json(err); }
});

// Stats API
app.get('/api/stats', async (req, res) => {
    try {
        const [students] = await pool.query('SELECT COUNT(*) as count FROM students');
        const [teachers] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "teacher"');
        const [notices] = await pool.query('SELECT COUNT(*) as count FROM notices');
        res.json({
            totalStudents: students[0]?.count || 0,
            totalTeachers: teachers[0]?.count || 0,
            activeNotices: notices[0]?.count || 0,
            revenue: 125000 
        });
    } catch (err) { 
        console.error('Error fetching stats:', err);
        res.status(500).json({ error: 'Database error', details: err.message }); 
    }
});

// CRUD for Students
app.get('/api/students', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT s.*, sec.section_name AS section 
            FROM students s
            LEFT JOIN sections sec ON s.section_id = sec.section_id
        `);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});
app.post('/api/students', async (req, res) => {
    try {
        const { student_id, name, email, phone, class_id, section, dob, gender, address, blood_group, admission_date, avatar } = req.body;
        
        let sectionId = null;
        if (section && class_id) {
            const [secRows] = await pool.query('SELECT section_id FROM sections WHERE class_id = ? AND section_name = ?', [class_id, section]);
            if (secRows.length > 0) {
                sectionId = secRows[0].section_id;
            }
        }

        await pool.query(
            'INSERT INTO students (student_id, name, email, phone, class_id, section_id, dob, gender, address, blood_group, admission_date, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [student_id, name, email, phone, class_id || null, sectionId, dob || null, gender || null, address || null, blood_group || null, admission_date || null, avatar || null]
        );
        res.json({ message: 'Student added' });
    } catch (err) {
        console.error('Error adding student:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});
app.delete('/api/students/:student_id', async (req, res) => {
    try {
        const { student_id } = req.params;
        console.log(`🗑️ Deleting student: ${student_id}`);
        // Manually cascade related tables to ensure data integrity
        await pool.query('DELETE FROM attendance WHERE student_id = ?', [student_id]);
        await pool.query('DELETE FROM parents WHERE student_id = ?', [student_id]);
        await pool.query('DELETE FROM fees WHERE student_id = ?', [student_id]);
        await pool.query('DELETE FROM exam_marks WHERE student_id = ?', [student_id]);
        await pool.query('DELETE FROM hostel WHERE student_id = ?', [student_id]);
        await pool.query('DELETE FROM students WHERE student_id = ?', [student_id]);
        
        console.log(`✅ Deleted student: ${student_id} and all related records.`);
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error('🔥 Error deleting student:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// CRUD for Teachers
app.get('/api/teachers', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE role = "teacher"');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching teachers:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// CRUD for Users
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// CRUD for Notices
app.get('/api/notices', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM notices ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching notices:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});
app.post('/api/notices', async (req, res) => {
    try {
        const { title, content, type } = req.body;
        await pool.query('INSERT INTO notices (title, content, type) VALUES (?, ?, ?)', [title, content, type]);
        res.json({ message: 'Notice posted' });
    } catch (err) {
        console.error('Error posting notice:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// Attendance
app.get('/api/attendance', async (req, res) => {
    try {
        const { date } = req.query;
        let query = 'SELECT * FROM attendance';
        const params = [];
        if (date) {
            query += ' WHERE date = ?';
            params.push(date);
        }
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching attendance:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});
app.post('/api/attendance', async (req, res) => {
    try {
        const records = Array.isArray(req.body) ? req.body : [req.body];
        const values = records.map(r => [r.student_id, r.status, r.date]);
        
        if (values.length > 0) {
            const studentIds = records.map(r => r.student_id);
            const dateVal = records[0].date;
            // Delete existing records for these students on this date to prevent duplicates
            await pool.query('DELETE FROM attendance WHERE date = ? AND student_id IN (?)', [dateVal, studentIds]);
            // Bulk insert new records
            await pool.query('INSERT INTO attendance (student_id, status, date) VALUES ?', [values]);
        }
        res.json({ message: 'Attendance recorded successfully' });
    } catch (err) {
        console.error('Error recording attendance:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// Fees API
app.get('/api/fees', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM fees');
        res.json({
            totalCollected: rows.filter(r => r.status === 'Paid').reduce((sum, r) => sum + Number(r.amount), 0) || 125000,
            pendingAmount: rows.filter(r => r.status === 'Unpaid').reduce((sum, r) => sum + Number(r.amount), 0) || 45000,
            history: rows
        });
    } catch (err) { res.status(500).json(err); }
});
app.post('/api/fees', async (req, res) => {
    try {
        const { student_id, category, amount, status, due_date, payment_method } = req.body;
        await pool.query('INSERT INTO fees (student_id, category, amount, status, due_date, payment_method) VALUES (?, ?, ?, ?, ?, ?)', 
            [student_id, category, amount, status, due_date, payment_method]);
        res.json({ success: true, message: 'Fee record created' });
    } catch (err) { res.status(500).json(err); }
});

// Timetable API
app.get('/api/timetable', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM subjects');
        res.json(rows);
    } catch (err) { res.status(500).json(err); }
});
app.post('/api/timetable', async (req, res) => {
    try {
        const { name, class_id, teacher_id } = req.body;
        await pool.query('INSERT INTO subjects (name, class_id, teacher_id) VALUES (?, ?, ?)', [name, class_id, teacher_id]);
        res.json({ success: true, message: 'Subject scheduled' });
    } catch (err) { res.status(500).json(err); }
});

// Exams API
app.get('/api/exams', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM exams');
        res.json(rows);
    } catch (err) { res.status(500).json(err); }
});
app.post('/api/exams', async (req, res) => {
    try {
        const { exam_name, date, class_id } = req.body;
        await pool.query('INSERT INTO exams (exam_name, date, class_id) VALUES (?, ?, ?)', [exam_name, date, class_id]);
        res.json({ success: true, message: 'Exam created' });
    } catch (err) { res.status(500).json(err); }
});

// Transport API
app.get('/api/transport', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM transport');
        res.json(rows);
    } catch (err) { res.status(500).json(err); }
});
app.post('/api/transport', async (req, res) => {
    try {
        const { route_name, driver_name, vehicle_no, phone } = req.body;
        await pool.query('INSERT INTO transport (route_name, driver_name, vehicle_no, phone) VALUES (?, ?, ?, ?)', 
            [route_name, driver_name, vehicle_no, phone]);
        res.json({ success: true });
    } catch (err) { res.status(500).json(err); }
});

// Hostel API
app.get('/api/hostel', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM hostel');
        res.json(rows);
    } catch (err) { res.status(500).json(err); }
});
app.post('/api/hostel', async (req, res) => {
    try {
        const { room_no, student_id, block, fee_status } = req.body;
        await pool.query('INSERT INTO hostel (room_no, student_id, block, fee_status) VALUES (?, ?, ?, ?)', 
            [room_no, student_id, block, fee_status]);
        res.json({ success: true });
    } catch (err) { res.status(500).json(err); }
});

// Library API
app.get('/api/library', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM library_books');
        res.json(rows);
    } catch (err) { res.status(500).json(err); }
});
app.post('/api/library', async (req, res) => {
    try {
        const { title, author, category, status } = req.body;
        await pool.query('INSERT INTO library_books (title, author, category, status) VALUES (?, ?, ?, ?)', 
            [title, author, category, status || 'Available']);
        res.json({ success: true });
    } catch (err) { res.status(500).json(err); }
});

// Messages API
app.get('/api/messages', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) { res.status(500).json(err); }
});
app.post('/api/messages', async (req, res) => {
    try {
        const { sender_id, receiver_id, content } = req.body;
        await pool.query('INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)', 
            [sender_id, receiver_id, content]);
        res.json({ success: true });
    } catch (err) { res.status(500).json(err); }
});

// Start Server
const PORT = process.env.PORT || 5000;
initDb().then(() => {
    app.listen(PORT, () => console.log(`🚀 Legendary API running on port ${PORT}`));
});
