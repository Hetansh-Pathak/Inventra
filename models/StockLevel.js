const mongoose = require('mongoose');

const stockLevelSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  warehouse_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  quantity: { type: Number, required: true, default: 0, min: 0 },
  last_updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

stockLevelSchema.index({ product_id: 1, location_id: 1 }, { unique: true });

module.exports = mongoose.model('StockLevel', stockLevelSchema);
