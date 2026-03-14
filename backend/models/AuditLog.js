const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user_name: { type: String, required: true },
  action: { type: String, required: true, enum: ['created','updated','deleted','validated','confirmed','canceled','login','logout'] },
  module: { type: String, required: true, enum: ['Products','Receipts','Deliveries','Transfers','Adjustments','Users','Warehouses','Settings','Auth'] },
  record_id: { type: mongoose.Schema.Types.ObjectId },
  record_reference: { type: String },
  changes: { type: mongoose.Schema.Types.Mixed }, // JSON payload
  ip_address: { type: String },
  user_agent: { type: String }
}, { timestamps: true });

auditLogSchema.index({ user_id: 1 });
auditLogSchema.index({ module: 1 });
auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
