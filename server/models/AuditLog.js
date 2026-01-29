const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: { type: String, required: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    details: { type: String },
    timestamp: { type: Date, default: Date.now },
    ipAddress: { type: String }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
