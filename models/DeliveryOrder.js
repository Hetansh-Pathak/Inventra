const mongoose = require('mongoose');

const deliveryOrderSchema = new mongoose.Schema({
  delivery_number: { type: String, required: true, unique: true },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  status: { type: String, enum: ['draft','ready','picked','packed','done','canceled'], default: 'draft' },
  delivery_date: { type: Date },
  shipping_address: { type: String },
  notes: { type: String },
  lines: [{
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    requested_qty: { type: Number, required: true, min: 1 },
    picked_qty: { type: Number, default: 0 },
    delivered_qty: { type: Number, default: 0 },
    unit_price: { type: Number, required: true, min: 0 },
    unit_of_measure: { type: String },
    notes: { type: String }
  }],
  ready_at: { type: Date },
  picked_at: { type: Date },
  packed_at: { type: Date },
  done_at: { type: Date },
  canceled_at: { type: Date },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  validated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

deliveryOrderSchema.pre('validate', async function(next) {
  if (this.isNew && !this.delivery_number) {
    const count = await mongoose.models.DeliveryOrder.countDocuments();
    this.delivery_number = `DEL-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('DeliveryOrder', deliveryOrderSchema);
