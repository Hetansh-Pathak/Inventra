const mongoose = require('mongoose');

const reorderRuleSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  warehouse_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  min_quantity: { type: Number, required: true, min: 0 },
  reorder_quantity: { type: Number, required: true, min: 1 },
  is_active: { type: Boolean, default: true },
  last_triggered_at: { type: Date, default: null },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

reorderRuleSchema.index({ product_id: 1, location_id: 1 }, { unique: true });

module.exports = mongoose.model('ReorderRule', reorderRuleSchema);
