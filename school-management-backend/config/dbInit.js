const mysql = require('mysql2/promise');
require('dotenv').config();

const initDb = async () => {
    const dbName = process.env.DB_NAME || 'school_db';
    
    console.log(`Connecting to database at ${process.env.DB_HOST || '127.0.0.1'} as ${process.env.DB_USER || 'root'}...`);
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: undefined,
            connectTimeout: 10000 // 10s
        });
    } catch (err) {
        if (err.code === 'ECONNREFUSED') {
            console.error('\x1b[31m%s\x1b[0m', '❌ ERROR: Database connection refused!');
            console.error('\x1b[33m%s\x1b[0m', `👉 Please ensure your MySQL server (XAMPP, Laragon, or MySQL Service) is running on ${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || 3306}`);
        } else {
            console.error('\x1b[31m%s\x1b[0m', '❌ ERROR: Failed to connect to database:');
            console.error(err);
        }
        process.exit(1);
    }

    try {
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        await connection.query(`USE ${dbName}`);
    } catch (err) {
        console.log('⚠️ Could not create/use database explicitly, attempting to continue...');
    }

    // Helper to add column if not exists
    const addColumn = async (table, column, definition) => {
        try {
            await connection.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
        } catch (err) {}
    };

    const tables = [
        // 1. Users & RBAC
        `CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE, password VARCHAR(255), role ENUM('admin', 'teacher', 'student', 'parent'), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
        
        // 2. Academics
        `CREATE TABLE IF NOT EXISTS classes (class_id INT PRIMARY KEY, class_name VARCHAR(50), teacher_id INT)`,
        `CREATE TABLE IF NOT EXISTS sections (section_id INT AUTO_INCREMENT PRIMARY KEY, class_id INT, section_name VARCHAR(10), INDEX (class_id))`,
        `CREATE TABLE IF NOT EXISTS subjects (subject_id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), class_id INT, teacher_id INT)`,
        
        // 3. Students & Parents
        `CREATE TABLE IF NOT EXISTS students (student_id VARCHAR(20) PRIMARY KEY, name VARCHAR(100), email VARCHAR(100), phone VARCHAR(20), class_id INT, section_id INT, dob DATE, gender VARCHAR(10), address TEXT, blood_group VARCHAR(5), admission_date DATE, avatar LONGTEXT)`,
        `CREATE TABLE IF NOT EXISTS parents (parent_id INT AUTO_INCREMENT PRIMARY KEY, student_id VARCHAR(20), name VARCHAR(100), phone VARCHAR(20), email VARCHAR(100), occupation VARCHAR(100))`,
        `CREATE TABLE IF NOT EXISTS teachers (teacher_id VARCHAR(20) PRIMARY KEY, name VARCHAR(100), email VARCHAR(100), phone VARCHAR(20), class_id INT, dob DATE, gender VARCHAR(10), address TEXT, blood_group VARCHAR(5), admission_date DATE, avatar LONGTEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
        
        // 4. Attendance
        `CREATE TABLE IF NOT EXISTS attendance (id INT AUTO_INCREMENT PRIMARY KEY, student_id VARCHAR(20), date DATE, status ENUM('Present', 'Absent', 'Late', 'Leave'), type ENUM('Manual', 'QR', 'Face'))`,
        `CREATE TABLE IF NOT EXISTS staff_attendance (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, date DATE, check_in TIME, check_out TIME, status VARCHAR(20))`,
        
        // 5. Finance
        `CREATE TABLE IF NOT EXISTS fees (id INT AUTO_INCREMENT PRIMARY KEY, student_id VARCHAR(20), category VARCHAR(50), amount DECIMAL(10,2), status ENUM('Paid', 'Unpaid', 'Partial'), due_date DATE, payment_method VARCHAR(20))`,
        
        // 6. Examination
        `CREATE TABLE IF NOT EXISTS exams (id INT AUTO_INCREMENT PRIMARY KEY, exam_name VARCHAR(100), date DATE, class_id INT)`,
        `CREATE TABLE IF NOT EXISTS exam_marks (id INT AUTO_INCREMENT PRIMARY KEY, exam_id INT, student_id VARCHAR(20), subject_id INT, marks_obtained INT, total_marks INT)`,
        
        // 7. Logistics
        `CREATE TABLE IF NOT EXISTS library_books (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(200), author VARCHAR(100), category VARCHAR(50), status ENUM('Available', 'Issued'))`,
        `CREATE TABLE IF NOT EXISTS transport (id INT AUTO_INCREMENT PRIMARY KEY, route_name VARCHAR(100), driver_name VARCHAR(100), vehicle_no VARCHAR(20), phone VARCHAR(20))`,
        `CREATE TABLE IF NOT EXISTS hostel (id INT AUTO_INCREMENT PRIMARY KEY, room_no VARCHAR(10), student_id VARCHAR(20), block VARCHAR(20), fee_status VARCHAR(20))`,
        
        // 8. Communication
        `CREATE TABLE IF NOT EXISTS notices (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(200), content TEXT, type VARCHAR(20), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
        `CREATE TABLE IF NOT EXISTS messages (id INT AUTO_INCREMENT PRIMARY KEY, sender_id INT, receiver_id INT, content TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
        `CREATE TABLE IF NOT EXISTS admissions (id INT AUTO_INCREMENT PRIMARY KEY, full_name VARCHAR(100), email VARCHAR(100), phone VARCHAR(20), status VARCHAR(20) DEFAULT 'Pending')`
    ];

    for (const table of tables) {
        await connection.query(table);
    }

    // Auto-migrate: Alter parents table to add occupation column if missing
    try {
        await connection.query("ALTER TABLE parents ADD COLUMN occupation VARCHAR(100)");
        console.log('🔄 Database Migration: Added occupation column to parents.');
    } catch (err) {}

    // Auto-migrate: Add all teacher detail columns if they don't exist
    const teacherColumns = [
        ['qualification', 'TEXT'],
        ['subject', 'VARCHAR(100)'],
        ['experience', 'VARCHAR(50)'],
        ['designation', 'VARCHAR(100)'],
        ['dept', 'VARCHAR(100)'],
        ['status', 'VARCHAR(20)'],
        ['class', 'VARCHAR(100)'],
        ['maritalStatus', 'VARCHAR(20)'],
        ['contractType', 'VARCHAR(20)'],
        ['shift', 'VARCHAR(20)'],
        ['workLocation', 'VARCHAR(100)'],
        ['details', 'TEXT'],
        ['color', 'VARCHAR(20)'],
        ['rating', 'DECIMAL(3,2)'],
        ['fatherName', 'VARCHAR(100)'],
        ['motherName', 'VARCHAR(100)'],
        ['permanentAddress', 'TEXT'],
        ['height', 'VARCHAR(10)'],
        ['weight', 'VARCHAR(10)'],
        ['bankAccount', 'VARCHAR(50)'],
        ['bankName', 'VARCHAR(100)'],
        ['ifscCode', 'VARCHAR(20)'],
        ['nationalId', 'VARCHAR(50)'],
        ['prevSchoolName', 'VARCHAR(100)'],
        ['prevSchoolAddress', 'TEXT'],
        ['facebook', 'VARCHAR(255)'],
        ['linkedin', 'VARCHAR(255)'],
        ['instagram', 'VARCHAR(255)'],
        ['youtube', 'VARCHAR(255)'],
        ['loginEmail', 'VARCHAR(100)'],
        ['password', 'VARCHAR(255)'],
        ['documents', 'LONGTEXT']
    ];

    for (const [col, def] of teacherColumns) {
        await addColumn('teachers', col, def);
    }

    // Auto-migrate: Add user profile detail columns if they don't exist
    const userColumns = [
        ['phone', 'VARCHAR(20)'],
        ['location', 'VARCHAR(100)'],
        ['achievements', 'TEXT'],
        ['avatar', 'LONGTEXT'],
        ['coverImage', 'LONGTEXT'],
        ['lastLogin', 'VARCHAR(50)'],
        ['permissions', 'TEXT']
    ];

    for (const [col, def] of userColumns) {
        await addColumn('users', col, def);
    }

    // Auto-migrate: Add parent details columns if they don't exist
    const parentColumns = [
        ['avatarUrl', 'LONGTEXT'],
        ['relation', 'VARCHAR(50)'],
        ['company', 'VARCHAR(100)'],
        ['dob', 'VARCHAR(30)'],
        ['gender', 'VARCHAR(20)'],
        ['emergencyContact', 'VARCHAR(50)'],
        ['username', 'VARCHAR(100)'],
        ['password', 'VARCHAR(255)'],
        ['address', 'TEXT']
    ];

    for (const [col, def] of parentColumns) {
        await addColumn('parents', col, def);
    }

    // Auto-migrate: Alter attendance status column to support 'Leave'
    try {
        await connection.query("ALTER TABLE attendance MODIFY COLUMN status ENUM('Present', 'Absent', 'Late', 'Leave')");
        console.log('🔄 Database Migration: Modified attendance status column to support Leave.');
    } catch (err) {
        console.warn('⚠️ Database Migration Warning: Could not alter attendance status column:', err.message);
    }

    // Seed Default Users if they don't exist
    const [existing] = await connection.query('SELECT * FROM users WHERE email = ?', ['admin@school.com']);
    if (existing.length === 0) {
        await connection.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', 
            ['Super Admin', 'admin@school.com', 'demo123', 'admin']);
        await connection.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', 
            ['John Parent', 'parent@school.com', 'demo123', 'parent']);
        console.log('🌱 Seeded Demo Accounts: admin@school.com & parent@school.com');
    }

    // Seed default classes if none exist
    const [existingClasses] = await connection.query('SELECT COUNT(*) as count FROM classes');
    if (existingClasses[0].count === 0) {
        await connection.query('INSERT INTO classes (class_id, class_name, teacher_id) VALUES (9, "Grade 9", 1), (10, "Grade 10", 2), (11, "Grade 11", 3), (12, "Grade 12", 4)');
    }

    // Seed sections
    const [existingSections] = await connection.query('SELECT COUNT(*) as count FROM sections');
    if (existingSections[0].count === 0) {
        await connection.query('INSERT INTO sections (class_id, section_name) VALUES (9, "A"), (9, "B"), (10, "A"), (10, "B"), (11, "A"), (12, "A")');
    }

    // Seed students
    const [existingStudents] = await connection.query('SELECT COUNT(*) as count FROM students');
    if (existingStudents[0].count === 0) {
        await connection.query(`INSERT INTO students (student_id, name, email, phone, class_id, section_id, dob, gender, address, blood_group, admission_date) VALUES 
        ("STU101", "Liam Fox", "liam.fox@edupro.edu", "+1 234 567 890", 10, 3, "2010-05-12", "Male", "123 School Lane, NY", "O+", "2026-01-12"),
        ("1", "Devon Lane", "devon.lane@edupro.edu", "+1 234 567 891", 10, 3, "2010-02-15", "Male", "789 School Rd, NY", "B+", "2026-09-01"),
        ("STU213", "Alex Johnson", "alex.johnson@example.com", "+1 234 567 900", 10, 4, "2010-02-15", "Male", "789 School Rd, NY", "B+", "2026-09-01")`);
    }

    // Seed teachers if none exist in users
    const [existingTeachers] = await connection.query('SELECT COUNT(*) as count FROM users WHERE role = "teacher"');
    if (existingTeachers[0].count === 0) {
        await connection.query('INSERT INTO users (name, email, password, role) VALUES ("Sarah Jenkins", "sarah.j@school.com", "demo123", "teacher"), ("Michael Chang", "michael.c@school.com", "demo123", "teacher")');
    }

    // Seed teachers table if none exist
    const [existingTeachersTable] = await connection.query('SELECT COUNT(*) as count FROM teachers');
    if (existingTeachersTable[0].count === 0) {
        await connection.query(`INSERT INTO teachers (teacher_id, name, email, phone, class_id, dob, gender, address, blood_group, admission_date) VALUES 
        ("AD52365", "Eleanor Pena", "eleanor.p@edupro.com", "+1 234 567 890", 10, "1985-05-12", "Female", "724 Oakmound Road, Chicago, IL", "A+", "2024-01-12"),
        ("AD52366", "Robert Fox", "robert.f@edupro.com", "+1 234 567 891", 10, "1988-08-20", "Male", "831 Maple Avenue, Seattle, WA", "B+", "2024-02-15")`);
    }


    // Seed library books
    const [existingBooks] = await connection.query('SELECT COUNT(*) as count FROM library_books');
    if (existingBooks[0].count === 0) {
        await connection.query(`INSERT INTO library_books (title, author, category, status) VALUES 
        ("Introduction to Algorithms", "Thomas H. Cormen", "Computer Science", "Available"),
        ("A Brief History of Time", "Stephen Hawking", "Physics", "Available"),
        ("The Great Gatsby", "F. Scott Fitzgerald", "Literature", "Issued")`);
    }

    // Seed transport routes
    const [existingTransport] = await connection.query('SELECT COUNT(*) as count FROM transport');
    if (existingTransport[0].count === 0) {
        await connection.query(`INSERT INTO transport (route_name, driver_name, vehicle_no, phone) VALUES 
        ("Downtown Express", "John Doe", "NY-8829", "+1 555 0199"),
        ("Westside Shuttle", "David Miller", "NY-4412", "+1 555 0200")`);
    }

    // Seed hostel rooms
    const [existingHostel] = await connection.query('SELECT COUNT(*) as count FROM hostel');
    if (existingHostel[0].count === 0) {
        await connection.query(`INSERT INTO hostel (room_no, student_id, block, fee_status) VALUES 
        ("101", "STU101", "A Block", "Paid"),
        ("102", "1", "A Block", "Paid")`);
    }

    // Seed notices
    const [existingNotices] = await connection.query('SELECT COUNT(*) as count FROM notices');
    if (existingNotices[0].count === 0) {
        await connection.query(`INSERT INTO notices (title, content, type) VALUES 
        ("Annual Sports Day 2026", "The Annual Sports Meet will be held on June 15th, 2026. Participation registrations are open.", "Event"),
        ("Final Examination Timetable Out", "Please check the examination module for the detailed schedule of final exams starting next month.", "Academic")`);
    }

    // Seed exams
    const [existingExams] = await connection.query('SELECT COUNT(*) as count FROM exams');
    if (existingExams[0].count === 0) {
        await connection.query(`INSERT INTO exams (exam_name, date, class_id) VALUES 
        ("First Term Exams", "2026-06-10", 10),
        ("Final Term Exams", "2026-11-20", 10)`);
    }

    // Seed fees
    const [existingFees] = await connection.query('SELECT COUNT(*) as count FROM fees');
    if (existingFees[0].count === 0) {
        await connection.query(`INSERT INTO fees (student_id, category, amount, status, due_date, payment_method) VALUES 
        ("1", "Tuition Fee", 450.00, "Paid", "2026-05-05", "Online"),
        ("1", "Transport Fee", 80.00, "Paid", "2026-05-05", "Online"),
        ("STU101", "Tuition Fee", 450.00, "Unpaid", "2026-06-05", "Pending")`);
    }

    await connection.end();
};

module.exports = initDb;
