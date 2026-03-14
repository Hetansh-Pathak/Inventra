const mongoose = require('mongoose');

const stockAdjustmentSchema = new mongoose.Schema({
  adjustment_number: { type: String, required: true, unique: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  warehouse_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  system_qty: { type: Number, required: true, min: 0 },
  counted_qty: { type: Number, required: true, min: 0 },
  difference: { type: Number, required: true },
  reason: { type: String, required: true, enum: ['damaged','expired','lost','correction','other'] },
  reason_notes: { type: String },
  status: { type: String, enum: ['draft','validated','canceled'], default: 'draft' },
  validated_at: { type: Date },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  validated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

stockAdjustmentSchema.pre('validate', async function(next) {
  if (this.isNew && !this.adjustment_number) {
    const count = await mongoose.models.StockAdjustment.countDocuments();
    this.adjustment_number = `ADJ-${String(count + 1).padStart(3, '0')}`;
  }
  if (this.isModified('counted_qty') || this.isModified('system_qty')) {
    this.difference = this.counted_qty - this.system_qty;
  }
  next();
});

module.exports = mongoose.model('StockAdjustment', stockAdjustmentSchema);
