const mongoose = require('mongoose');

const stockMoveSchema = new mongoose.Schema({
  move_type: { 
    type: String, required: true, 
    enum: ['receipt','delivery','transfer_out','transfer_in','adjustment_increase','adjustment_decrease'] 
  },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  product_name: { type: String, required: true },
  product_sku: { type: String, required: true },
  from_location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', default: null },
  from_location_name: { type: String },
  from_warehouse_name: { type: String },
  to_location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', default: null },
  to_location_name: { type: String },
  to_warehouse_name: { type: String },
  quantity: { type: Number, required: true },
  quantity_before: { type: Number, required: true },
  quantity_after: { type: Number, required: true },
  reference_type: { type: String, required: true, enum: ['Receipt','DeliveryOrder','InternalTransfer','StockAdjustment'] },
  reference_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  reference_number: { type: String, required: true },
  notes: { type: String },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created_by_name: { type: String }
}, { timestamps: true });

stockMoveSchema.index({ product_id: 1, createdAt: -1 });
stockMoveSchema.index({ reference_id: 1 });
stockMoveSchema.index({ move_type: 1 });
stockMoveSchema.index({ createdAt: -1 });

module.exports = mongoose.model('StockMove', stockMoveSchema);
