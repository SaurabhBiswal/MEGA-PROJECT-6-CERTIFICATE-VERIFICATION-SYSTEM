const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    certificateId: { type: String, required: true, unique: true },
    studentName: { type: String, required: true },
    email: { type: String, required: true },
    internshipDomain: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    issuedBy: { type: String, default: 'CertifyHub Corp' },
    qrCode: { type: String }, // Base64 QR code
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certificate', certificateSchema);
