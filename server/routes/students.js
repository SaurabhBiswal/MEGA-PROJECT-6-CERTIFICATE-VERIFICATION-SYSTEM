const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const express = require('express');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Certificate = require('../models/Certificate');
const router = express.Router();


/**
 * @swagger
 * /api/students/login:
 *   post:
 *     summary: Student login
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const normalizedEmail = email.trim().toLowerCase();

        // Use regex for case-insensitive search in case existing data is messy
        let student = await Student.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } });

        if (student) {
            // Support Dual Login: Set/Update password for existing account
            student.password = password;
            if (name) student.name = name;
            // Ensure email is also normalized in DB now
            student.email = normalizedEmail;
            await student.save();
            return res.status(200).json({ message: 'Account updated successfully! Dual login enabled.' });
        }

        student = new Student({ name, email: normalizedEmail, password });
        await student.save();
        res.status(201).json({ message: 'Student registered successfully' });


    } catch (err) {
        console.error('Registration/Link Error:', err);
        res.status(400).json({ error: err.message });
    }
});



router.post('/google-login', async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { name, email } = ticket.getPayload();
        const normalizedEmail = email.trim().toLowerCase();

        let student = await Student.findOne({ email: normalizedEmail });
        if (!student) {
            // Auto-register if student doesn't exist
            student = new Student({
                name,
                email: normalizedEmail,
                password: Math.random().toString(36).slice(-8) // Random password
            });
            await student.save();
        }


        const jwtToken = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.json({ token: jwtToken, student: { id: student._id, name: student.name, email: student.email } });
    } catch (err) {
        res.status(500).json({ error: 'Google authentication failed' });
    }
});

const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../utils/emailService');

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(404).json({ error: 'Account not found' });
        }

        // Generate Token
        const token = crypto.randomBytes(32).toString('hex');
        student.resetPasswordToken = token;
        student.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await student.save();

        // Send Email
        // Assuming client runs on 5173 locally
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const resetLink = `${clientUrl}/reset-password/${token}`;
        await sendPasswordResetEmail(student.email, resetLink);

        res.json({ message: 'Password reset link sent to your email' });

    } catch (err) {
        console.error('Forgot Password Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Reset Password Route
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { password } = req.body;
        const student = await Student.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!student) {
            return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
        }

        // Update Password
        student.password = password; // Will be hashed by pre-save hook
        student.resetPasswordToken = undefined;
        student.resetPasswordExpires = undefined;
        await student.save();

        res.json({ message: 'Password has been reset successfully' });

    } catch (err) {
        console.error('Reset Password Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


router.post('/login', async (req, res) => {


    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ email });
        if (!student || !(await student.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.json({ token, student: { id: student._id, name: student.name, email: student.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/students/me:
 *   get:
 *     summary: Get student certificates
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of certificates
 */
router.get('/me', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'Not authenticated' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const student = await Student.findById(decoded.id).populate('certificates');

        // If no certificates in array, try matching by email
        if (student.certificates.length === 0) {
            const certs = await Certificate.find({ email: student.email });
            return res.json(certs);
        }

        res.json(student.certificates);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Public Profile Route
router.get('/public/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).select('-password -__v');
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        const certificates = await Certificate.find({ studentEmail: student.email });
        res.json({ student, certificates });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
