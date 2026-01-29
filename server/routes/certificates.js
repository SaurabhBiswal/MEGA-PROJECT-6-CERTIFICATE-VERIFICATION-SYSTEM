const express = require('express');
const XLSX = require('xlsx');
const qr = require('qrcode');
const Certificate = require('../models/Certificate');
const AuditLog = require('../models/AuditLog');
const auth = require('../middleware/auth');
const { generatePDF } = require('../utils/pdfGenerator');

const { sendCertificateEmail } = require('../utils/emailService');
const router = express.Router();


const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public Search
router.get('/verify/:id', async (req, res) => {
    try {
        const certificate = await Certificate.findOne({
            certificateId: { $regex: new RegExp(`^${req.params.id}$`, 'i') }
        });
        if (!certificate) return res.status(404).json({ error: 'Certificate not found' });

        certificate.views += 1;
        await certificate.save();

        res.json(certificate);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Public: Download PDF
router.get('/download/:id', async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ certificateId: req.params.id });
        if (!certificate) return res.status(404).json({ error: 'Certificate not found' });

        const pdfBuffer = await generatePDF(certificate);

        certificate.downloads += 1;
        await certificate.save();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=Certificate_${certificate.certificateId}.pdf`,
            'Content-Length': pdfBuffer.length
        });
        res.send(pdfBuffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Bulk Upload
router.post('/upload', auth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Please upload an Excel file' });

        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const certificates = [];

        for (const row of data) {
            const { studentName, email, internshipDomain, startDate, endDate } = row;
            const certificateId = `CH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

            // Generate QR Code
            const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
            const qrCodeData = `${clientUrl}/verify/${certificateId}`;

            const qrCode = await qr.toDataURL(qrCodeData);

            certificates.push({
                certificateId,
                studentName,
                email,
                internshipDomain,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                qrCode
            });
        }

        await Certificate.insertMany(certificates);
        console.log(`✅ ${certificates.length} certificates saved to DB`);

        // Audit Log
        await new AuditLog({
            action: 'CERTIFICATE_BULK_UPLOAD',
            performedBy: req.user.id,
            details: `Uploaded ${certificates.length} certificates via Excel`,
            ipAddress: req.ip
        }).save();

        // Background tasks (Fire & Forget, but safely)
        certificates.forEach(async (cert) => {
            try {
                const pdfBuffer = await generatePDF(cert);
                await sendCertificateEmail(cert.email, cert.studentName, cert.certificateId, pdfBuffer);
            } catch (err) {
                console.error(`❌ Failed to send email to ${cert.email}:`, err.message);
            }
        });

        res.status(201).json({ message: `${certificates.length} certificates generated and emails queued` });

    } catch (err) {
        console.error('❌ Upload Error Details:', err);
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get all certificates
router.get('/all', auth, async (req, res) => {
    try {
        const certificates = await Certificate.find().sort({ createdAt: -1 });
        res.json(certificates);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
