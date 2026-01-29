const express = require('express');
const Certificate = require('../models/Certificate');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/stats', auth, async (req, res) => {
    try {
        const total = await Certificate.countDocuments();
        const stats = await Certificate.aggregate([
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$views" },
                    totalDownloads: { $sum: "$downloads" }
                }
            }
        ]);

        const recent = await Certificate.find().sort({ createdAt: -1 }).limit(5);

        // Time-series data for chart
        const chartData = await Certificate.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } },
            { $limit: 7 }
        ]);

        res.json({
            total,
            views: stats[0]?.totalViews || 0,
            downloads: stats[0]?.totalDownloads || 0,
            recent,
            chartData
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
