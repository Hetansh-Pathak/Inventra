const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  receipt_number: { type: String, required: true, unique: true },
  supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  status: { type: String, enum: ['draft','confirmed','validated','done','canceled'], default: 'draft' },
  expected_date: { type: Date },
  reference_number: { type: String, trim: true },
  notes: { type: String },
  lines: [{
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    expected_qty: { type: Number, required: true, min: 1 },
    received_qty: { type: Number, default: 0, min: 0 },
    unit_price: { type: Number, required: true, min: 0 },
    unit_of_measure: { type: String },
    notes: { type: String }
  }],
  confirmed_at: { type: Date, default: null },
  validated_at: { type: Date, default: null },
  done_at: { type: Date, default: null },
  canceled_at: { type: Date, default: null },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  confirmed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  validated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

receiptSchema.virtual('total_lines').get(function() { return this.lines.length; });
receiptSchema.virtual('total_expected_qty').get(function() { return this.lines.reduce((acc, line) => acc + line.expected_qty, 0); });
receiptSchema.virtual('total_received_qty').get(function() { return this.lines.reduce((acc, line) => acc + line.received_qty, 0); });
receiptSchema.virtual('estimated_value').get(function() { return this.lines.reduce((acc, line) => acc + (line.expected_qty * line.unit_price), 0); });

receiptSchema.pre('validate', async function(next) {
  if (this.isNew && !this.receipt_number) {
    const count = await mongoose.models.Receipt.countDocuments();
    this.receipt_number = `REC-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Receipt', receiptSchema);
