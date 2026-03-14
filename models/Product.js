const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  unit_of_measure: { 
    type: String, required: true, 
    enum: ['kg','g','pcs','liters','ml','meters','cm','boxes','sets','pairs','rolls','bags']
  },
  cost_price: { type: Number, required: true, min: 0 },
  selling_price: { type: Number, min: 0, default: 0 },
  reorder_level: { type: Number, default: 0, min: 0 },
  description: { type: String, trim: true },
  image_url: { type: String, default: null },
  is_active: { type: Boolean, default: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String]
}, { timestamps: true });

productSchema.index({ sku: 1 }, { unique: true });
productSchema.index({ name: 'text', sku: 'text' });
productSchema.index({ category_id: 1 });
productSchema.index({ is_active: 1 });

module.exports = mongoose.model('Product', productSchema);
