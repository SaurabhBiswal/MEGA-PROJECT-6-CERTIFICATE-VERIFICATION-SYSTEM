const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const router = express.Router();



router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

        // Audit log
        await new AuditLog({
            action: 'USER_LOGIN',
            performedBy: user._id,
            details: `Admin ${user.email} logged in`,
            ipAddress: req.ip
        }).save();

        res.json({ token, user: { name: user.name, email: user.email } });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
