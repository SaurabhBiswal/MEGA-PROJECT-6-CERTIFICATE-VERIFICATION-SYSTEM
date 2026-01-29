const express = require('express');
const AuditLog = require('../models/AuditLog');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/all', auth, async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .populate('performedBy', 'name email')
            .sort({ timestamp: -1 })
            .limit(100);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
