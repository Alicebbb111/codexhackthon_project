require('dotenv').config(); // ต้องอยู่บรรทัดบนสุดเสมอ
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// เชื่อมต่อ Aiven MySQL ด้วยตัวแปรแยก
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 1. Test หน้าแรก
app.get('/', (req, res) => {
    res.json({ message: "SkillBridge AI Backend is running and ready to connect!" });
});

// 2. API เช็คการเชื่อมต่อ Database
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        res.json({ status: "Success", message: "Connected to Aiven MySQL successfully!", result: rows[0].solution });
    } catch (err) {
        res.status(500).json({ status: "Error", message: "Database connection failed", error: err.message });
    }
});

// 3. API สมัครสมาชิก (Register)
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, username, password, target_career } = req.body;
        
        if (!username || !password || !email) {
            return res.status(400).json({ error: "กรุณากรอกข้อมูล Username, Password และ Email ให้ครบถ้วน" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            'INSERT INTO users (name, email, username, password, target_career) VALUES (?, ?, ?, ?, ?)',
            [name || 'User', email, username, hashedPassword, target_career || null]
        );

        res.status(201).json({ message: "สมัครสมาชิกสำเร็จ!", userId: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "Username หรือ Email นี้ถูกใช้งานไปแล้ว" });
        }
        res.status(500).json({ error: err.message });
    }
});

// 4. API เข้าสู่ระบบ (Login)
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "กรุณากรอก Username และ Password" });
        }

        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: "ไม่พบชื่อผู้ใช้งานนี้ในระบบ" });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ error: "รหัสผ่านไม่ถูกต้อง" });
        }

        delete user.password;
        res.json({ 
            message: "เข้าสู่ระบบสำเร็จ!", 
            user: user 
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// เริ่มรัน Server
app.listen(PORT, () => {
    console.log(`SkillBridge AI Server is running on port ${PORT}`);
});
