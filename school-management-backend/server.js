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
    const { name, email, password, role, phone } = req.body;
    try {
        await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, password, role]);
        
        if (role === 'student') {
            const studentId = `STU${Math.floor(10000 + Math.random() * 90000)}`;
            await pool.query(
                `INSERT INTO students (student_id, name, email, phone, class_id, section_id, dob, gender, blood_group, admission_date) 
                 VALUES (?, ?, ?, ?, 10, 3, '2010-01-01', 'Male', 'O+', CURDATE())`,
                [studentId, name, email, phone || null]
            );
        } else if (role === 'teacher') {
            const teacherId = `TCH${Math.floor(10000 + Math.random() * 90000)}`;
            await pool.query(
                `INSERT INTO teachers (teacher_id, name, email, phone, class_id, dob, gender, blood_group, admission_date, status) 
                 VALUES (?, ?, ?, ?, 10, '1990-01-01', 'Male', 'O+', CURDATE(), 'Active')`,
                [teacherId, name, email, phone || null]
            );
        } else if (role === 'parent') {
            await pool.query(
                `INSERT INTO parents (name, email, phone, occupation) 
                 VALUES (?, ?, ?, 'Guardian')`,
                [name, email, phone || null]
            );
        }

        res.json({ message: 'User registered' });
    } catch (err) { 
        console.error('Registration Error:', err);
        res.status(500).json(err); 
    }
});

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    // Support demo bypass token
    if (token === 'demo-token-12345') {
        req.user = { id: 1, role: 'admin' };
        return next();
    }

    try {
        const decoded = jwt.decode(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

// GET logged-in user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        
        // 1. Fetch the base user info
        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = users[0];
        
        // Remove password for security
        delete user.password;
        
        // 2. Fetch specific role details
        if (role === 'admin') {
            // Admin details are stored directly in users table
            res.json(user);
        } else if (role === 'teacher') {
            const [teachers] = await pool.query('SELECT * FROM teachers WHERE email = ? OR loginEmail = ?', [user.email, user.email]);
            if (teachers.length > 0) {
                res.json({ ...user, ...teachers[0] });
            } else {
                res.json(user);
            }
        } else if (role === 'student') {
            const [students] = await pool.query('SELECT * FROM students WHERE email = ?', [user.email]);
            if (students.length > 0) {
                res.json({ ...user, ...students[0] });
            } else {
                res.json(user);
            }
        } else if (role === 'parent') {
            const [parents] = await pool.query('SELECT * FROM parents WHERE email = ?', [user.email]);
            if (parents.length > 0) {
                res.json({ ...user, ...parents[0] });
            } else {
                res.json(user);
            }
        } else {
            res.json(user);
        }
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// PUT update logged-in user profile
app.put('/api/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        
        // Fetch current user details first
        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = users[0];
        
        const { 
            name, email, phone, location, achievements, avatar, coverImage, password,
            address, gender, dob, occupation, company, emergencyContact, relation
        } = req.body;
        
        // 1. Update the base users table
        let query = 'UPDATE users SET name = ?, email = ?';
        const params = [name || user.name, email || user.email];
        
        if (password) {
            query += ', password = ?';
            params.push(password);
        }
        
        // Profile fields stored in users table (primarily for admin, but general fields can be saved here too)
        if (phone !== undefined) { query += ', phone = ?'; params.push(phone); }
        if (location !== undefined) { query += ', location = ?'; params.push(location); }
        if (achievements !== undefined) { query += ', achievements = ?'; params.push(achievements); }
        if (avatar !== undefined) { query += ', avatar = ?'; params.push(avatar); }
        if (coverImage !== undefined) { query += ', coverImage = ?'; params.push(coverImage); }
        
        query += ' WHERE id = ?';
        params.push(userId);
        
        await pool.query(query, params);
        
        // 2. Update role-specific table if it exists
        const updatedEmail = email || user.email;
        
        if (role === 'teacher') {
            await pool.query(
                `UPDATE teachers SET 
                    name = ?, email = ?, phone = ?, address = ?, gender = ?, dob = ?, avatar = ?
                 WHERE email = ? OR loginEmail = ?`,
                [name || user.name, updatedEmail, phone || null, address || null, gender || null, dob || null, avatar || null, user.email, user.email]
            );
        } else if (role === 'student') {
            await pool.query(
                `UPDATE students SET 
                    name = ?, email = ?, phone = ?, address = ?, gender = ?, dob = ?, avatar = ?
                 WHERE email = ?`,
                [name || user.name, updatedEmail, phone || null, address || null, gender || null, dob || null, avatar || null, user.email]
            );
        } else if (role === 'parent') {
            await pool.query(
                `UPDATE parents SET 
                    name = ?, email = ?, phone = ?, address = ?, gender = ?, dob = ?, 
                    occupation = ?, company = ?, emergencyContact = ?, relation = ?, avatarUrl = ?
                 WHERE email = ?`,
                [
                    name || user.name, updatedEmail, phone || null, address || null, gender || null, dob || null, 
                    occupation || null, company || null, emergencyContact || null, relation || null, avatar || null,
                    user.email
                ]
            );
        }
        
        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// Stats API
app.get('/api/stats', async (req, res) => {
    try {
        const [students] = await pool.query('SELECT COUNT(*) as count FROM students');
        const [teachers] = await pool.query('SELECT COUNT(*) as count FROM teachers');
        const [parents] = await pool.query('SELECT COUNT(*) as count FROM parents');
        const [notices] = await pool.query('SELECT COUNT(*) as count FROM notices');
        res.json({
            totalStudents: students[0]?.count || 0,
            totalTeachers: teachers[0]?.count || 0,
            totalParents: parents[0]?.count || 0,
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
            SELECT s.*, sec.section_name AS section,
                   p.name AS parentName, p.phone AS parentPhone, p.email AS parentEmail, p.occupation AS parentOccupation
            FROM students s
            LEFT JOIN sections sec ON s.section_id = sec.section_id
            LEFT JOIN parents p ON s.student_id = p.student_id
        `);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});
app.post('/api/students', async (req, res) => {
    try {
        const { 
            student_id, name, email, phone, class_id, section, dob, gender, address, presentAddress,
            blood_group, bloodGroup, admission_date, avatar,
            parentName, parentPhone, parentEmail, parentOccupation
        } = req.body;
        
        let sectionId = null;
        if (section && class_id) {
            const [secRows] = await pool.query('SELECT section_id FROM sections WHERE class_id = ? AND section_name = ?', [class_id, section]);
            if (secRows.length > 0) {
                sectionId = secRows[0].section_id;
            }
        }

        const final_blood_group = blood_group || bloodGroup || null;
        const final_address = address || presentAddress || null;

        await pool.query(
            'INSERT INTO students (student_id, name, email, phone, class_id, section_id, dob, gender, address, blood_group, admission_date, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [student_id, name, email, phone, class_id || null, sectionId, dob || null, gender || null, final_address, final_blood_group, admission_date || null, avatar || null]
        );

        if (parentName) {
            await pool.query('DELETE FROM parents WHERE student_id = ?', [student_id]);
            await pool.query(
                'INSERT INTO parents (student_id, name, phone, email, occupation) VALUES (?, ?, ?, ?, ?)',
                [student_id, parentName, parentPhone || null, parentEmail || null, parentOccupation || null]
            );
        }

        res.json({ message: 'Student added' });
    } catch (err) {
        console.error('Error adding student:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});
app.put('/api/students/:student_id', async (req, res) => {
    try {
        const { student_id } = req.params;
        const { 
            name, email, phone, class_id, section, dob, gender, address, presentAddress,
            blood_group, bloodGroup, admission_date, avatar,
            parentName, parentPhone, parentEmail, parentOccupation
        } = req.body;
        
        let sectionId = null;
        if (section && class_id) {
            const [secRows] = await pool.query('SELECT section_id FROM sections WHERE class_id = ? AND section_name = ?', [class_id, section]);
            if (secRows.length > 0) {
                sectionId = secRows[0].section_id;
            }
        }

        const final_blood_group = blood_group || bloodGroup || null;
        const final_address = address || presentAddress || null;

        await pool.query(
            `UPDATE students SET 
                name = ?, email = ?, phone = ?, class_id = ?, section_id = ?, 
                dob = ?, gender = ?, address = ?, blood_group = ?, admission_date = ?, avatar = ?
             WHERE student_id = ?`,
            [name, email, phone, class_id || null, sectionId, dob || null, gender || null, final_address, final_blood_group, admission_date || null, avatar || null, student_id]
        );

        if (parentName) {
            await pool.query('DELETE FROM parents WHERE student_id = ?', [student_id]);
            await pool.query(
                'INSERT INTO parents (student_id, name, phone, email, occupation) VALUES (?, ?, ?, ?, ?)',
                [student_id, parentName, parentPhone || null, parentEmail || null, parentOccupation || null]
            );
        }

        res.json({ message: 'Student updated successfully' });
    } catch (err) {
        console.error('Error updating student:', err);
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

// CRUD for Parents
app.get('/api/parents', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, s.name AS student_name, s.class_id AS student_class, s.gender AS student_gender
            FROM parents p
            LEFT JOIN students s ON p.student_id = s.student_id
        `);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching parents:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

app.post('/api/parents', async (req, res) => {
    try {
        const {
            parent_id, id, name, student_id, phone, email, occupation,
            avatarUrl, img, relation, company, dob, gender, emergencyContact,
            username, password, address
        } = req.body;

        const final_parent_id = parent_id || id || null;
        const final_avatar = avatarUrl || img || null;

        const [result] = await pool.query(
            `INSERT INTO parents (
                parent_id, student_id, name, phone, email, occupation, avatarUrl, relation,
                company, dob, gender, emergencyContact, username, password, address
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                final_parent_id, student_id || null, name, phone || null, email || null, occupation || null,
                final_avatar, relation || null, company || null, dob || null, gender || null,
                emergencyContact || null, username || null, password || null, address || null
            ]
        );

        if (email) {
            const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
            if (existing.length === 0) {
                await pool.query(
                    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                    [name, email, password || 'demo123', 'parent']
                );
            }
        }

        res.json({ success: true, message: 'Parent profile created successfully', parentId: final_parent_id || result.insertId });
    } catch (err) {
        console.error('Error creating parent:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

app.put('/api/parents/:parent_id', async (req, res) => {
    try {
        const { parent_id } = req.params;
        const {
            name, student_id, phone, email, occupation, avatarUrl, img, relation,
            company, dob, gender, emergencyContact, username, password, address
        } = req.body;

        const final_avatar = avatarUrl || img || null;

        const [current] = await pool.query('SELECT * FROM parents WHERE parent_id = ?', [parent_id]);
        if (current.length === 0) {
            return res.status(404).json({ message: 'Parent not found' });
        }
        const oldEmail = current[0].email;

        await pool.query(
            `UPDATE parents SET 
                student_id = ?, name = ?, phone = ?, email = ?, occupation = ?, avatarUrl = ?, 
                relation = ?, company = ?, dob = ?, gender = ?, emergencyContact = ?, 
                username = ?, password = ?, address = ?
             WHERE parent_id = ?`,
            [
                student_id || current[0].student_id, name || current[0].name, phone || null, email || null, occupation || null,
                final_avatar, relation || null, company || null, dob || null, gender || null,
                emergencyContact || null, username || null, password || null, address || null,
                parent_id
            ]
        );

        if (email) {
            await pool.query(
                'UPDATE users SET name = ?, email = ?, password = ? WHERE email = ?',
                [name || current[0].name, email, password || 'demo123', oldEmail]
            );
        }

        res.json({ success: true, message: 'Parent profile updated successfully' });
    } catch (err) {
        console.error('Error updating parent:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

app.delete('/api/parents/:parent_id', async (req, res) => {
    try {
        const { parent_id } = req.params;

        const [current] = await pool.query('SELECT * FROM parents WHERE parent_id = ?', [parent_id]);
        if (current.length === 0) {
            return res.status(404).json({ message: 'Parent not found' });
        }
        const email = current[0].email;

        await pool.query('DELETE FROM parents WHERE parent_id = ?', [parent_id]);

        if (email) {
            await pool.query('DELETE FROM users WHERE email = ?', [email]);
        }

        res.json({ success: true, message: 'Parent profile deleted successfully' });
    } catch (err) {
        console.error('Error deleting parent:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// CRUD for Teachers
app.get('/api/teachers', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM teachers');
        if (rows.length === 0) {
            // Fallback seed / query
            const [userTeachers] = await pool.query('SELECT id as teacher_id, name, email, phone FROM users WHERE role = "teacher"');
            res.json(userTeachers.map(u => ({ ...u, teacher_id: `AD${u.teacher_id}` })));
        } else {
            res.json(rows);
        }
    } catch (err) {
        console.error('Error fetching teachers:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});
app.post('/api/teachers', async (req, res) => {
    try {
        const { 
            teacher_id, teacherId, 
            name, fullName, 
            email, phone, 
            class_id, class: class_name, 
            dob, gender, 
            address, currentAddress, 
            blood_group, bloodGroup, 
            admission_date, joinDate, join_date, 
            avatar,
            qualification, subject, experience, designation, dept, status,
            maritalStatus, contractType, shift, workLocation, details, color, rating,
            fatherName, motherName, permanentAddress, height, weight,
            bankAccount, bankName, ifscCode, nationalId, prevSchoolName, prevSchoolAddress,
            facebook, linkedin, instagram, youtube, loginEmail, password, documents
        } = req.body;
        
        const final_teacher_id = teacher_id || teacherId || null;
        const final_name = name || fullName || null;
        
        let final_class_id = class_id || null;
        if (!final_class_id && class_name) {
            const num = parseInt(class_name);
            if (!isNaN(num)) {
                final_class_id = num;
            }
        }

        const final_blood_group = blood_group || bloodGroup || null;
        const final_join_date = joinDate || admission_date || join_date || null;
        const final_address = address || currentAddress || null;
        const final_documents = documents ? (typeof documents === 'string' ? documents : JSON.stringify(documents)) : null;

        await pool.query(
            `INSERT INTO teachers (
                teacher_id, name, email, phone, class_id, dob, gender, address, blood_group, admission_date, avatar,
                qualification, subject, experience, designation, dept, status, class, maritalStatus, contractType,
                shift, workLocation, details, color, rating, fatherName, motherName, permanentAddress, height, weight,
                bankAccount, bankName, ifscCode, nationalId, prevSchoolName, prevSchoolAddress, facebook, linkedin,
                instagram, youtube, loginEmail, password, documents
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                final_teacher_id, final_name, email || null, phone || null, final_class_id, dob || null, gender || null, final_address, final_blood_group, final_join_date, avatar || null,
                qualification || null, subject || null, experience || null, designation || null, dept || null, status || 'Active', class_name || null, maritalStatus || null, contractType || null,
                shift || null, workLocation || null, details || null, color || null, rating || 4.8, fatherName || null, motherName || null, permanentAddress || null, height || null, weight || null,
                bankAccount || null, bankName || null, ifscCode || null, nationalId || null, prevSchoolName || null, prevSchoolAddress || null, facebook || null, linkedin || null,
                instagram || null, youtube || null, loginEmail || null, password || null, final_documents
            ]
        );

        try {
            const emailForUser = email || loginEmail;
            if (emailForUser) {
                const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [emailForUser]);
                if (existingUser.length === 0) {
                    await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [final_name, emailForUser, password || 'password123', 'teacher']);
                }
            }
        } catch (userErr) {
            console.error('Could not auto-create user for teacher:', userErr);
        }

        res.json({ message: 'Teacher added successfully' });
    } catch (err) {
        console.error('Error adding teacher:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});
app.put('/api/teachers/:teacher_id', async (req, res) => {
    try {
        const { teacher_id } = req.params;
        const { 
            name, fullName, 
            email, phone, 
            class_id, class: class_name, 
            dob, gender, 
            address, currentAddress, 
            blood_group, bloodGroup, 
            admission_date, joinDate, join_date, 
            avatar,
            qualification, subject, experience, designation, dept, status,
            maritalStatus, contractType, shift, workLocation, details, color, rating,
            fatherName, motherName, permanentAddress, height, weight,
            bankAccount, bankName, ifscCode, nationalId, prevSchoolName, prevSchoolAddress,
            facebook, linkedin, instagram, youtube, loginEmail, password, documents
        } = req.body;
        
        const final_name = name || fullName || null;
        
        let final_class_id = class_id || null;
        if (!final_class_id && class_name) {
            const num = parseInt(class_name);
            if (!isNaN(num)) {
                final_class_id = num;
            }
        }

        const final_blood_group = blood_group || bloodGroup || null;
        const final_join_date = joinDate || admission_date || join_date || null;
        const final_address = address || currentAddress || null;
        const final_documents = documents ? (typeof documents === 'string' ? documents : JSON.stringify(documents)) : null;

        await pool.query(
            `UPDATE teachers SET 
                name = ?, email = ?, phone = ?, class_id = ?, dob = ?, gender = ?, address = ?, blood_group = ?, admission_date = ?, avatar = ?,
                qualification = ?, subject = ?, experience = ?, designation = ?, dept = ?, status = ?, class = ?, maritalStatus = ?, contractType = ?,
                shift = ?, workLocation = ?, details = ?, color = ?, rating = ?, fatherName = ?, motherName = ?, permanentAddress = ?, height = ?, weight = ?,
                bankAccount = ?, bankName = ?, ifscCode = ?, nationalId = ?, prevSchoolName = ?, prevSchoolAddress = ?, facebook = ?, linkedin = ?,
                instagram = ?, youtube = ?, loginEmail = ?, password = ?, documents = ?
             WHERE teacher_id = ?`,
            [
                final_name, email || null, phone || null, final_class_id, dob || null, gender || null, final_address, final_blood_group, final_join_date, avatar || null,
                qualification || null, subject || null, experience || null, designation || null, dept || null, status || 'Active', class_name || null, maritalStatus || null, contractType || null,
                shift || null, workLocation || null, details || null, color || null, rating || 4.8, fatherName || null, motherName || null, permanentAddress || null, height || null, weight || null,
                bankAccount || null, bankName || null, ifscCode || null, nationalId || null, prevSchoolName || null, prevSchoolAddress || null, facebook || null, linkedin || null,
                instagram || null, youtube || null, loginEmail || null, password || null, final_documents,
                teacher_id
            ]
        );

        res.json({ message: 'Teacher updated successfully' });
    } catch (err) {
        console.error('Error updating teacher:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});
app.delete('/api/teachers/:teacher_id', async (req, res) => {
    try {
        const { teacher_id } = req.params;
        await pool.query('DELETE FROM teachers WHERE teacher_id = ?', [teacher_id]);
        res.json({ message: 'Teacher deleted successfully' });
    } catch (err) {
        console.error('Error deleting teacher:', err);
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
