const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  warehouse_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  description: { type: String },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

locationSchema.index({ warehouse_id: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Location', locationSchema);
