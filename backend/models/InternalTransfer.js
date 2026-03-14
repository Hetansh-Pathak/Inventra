const mongoose = require('mongoose');

const internalTransferSchema = new mongoose.Schema({
  transfer_number: { type: String, required: true, unique: true },
  from_location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  from_warehouse_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  to_location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  to_warehouse_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  status: { type: String, enum: ['draft','ready','done','canceled'], default: 'draft' },
  scheduled_date: { type: Date },
  notes: { type: String },
  lines: [{
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    unit_of_measure: { type: String },
    notes: { type: String }
  }],
  confirmed_at: { type: Date },
  done_at: { type: Date },
  canceled_at: { type: Date },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  validated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

internalTransferSchema.pre('validate', async function(next) {
  if (this.isNew && !this.transfer_number) {
    const count = await mongoose.models.InternalTransfer.countDocuments();
    this.transfer_number = `TRF-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('InternalTransfer', internalTransferSchema);
