const asyncHandler = require('express-async-handler');
const StockAdjustment = require('../models/StockAdjustment');
const StockLevel = require('../models/StockLevel');
const StockMove = require('../models/StockMove');
const AuditLog = require('../models/AuditLog');

exports.getAdjustments = asyncHandler(async (req, res) => {
  const adjustments = await StockAdjustment.find();
  res.status(200).json({ success: true, data: adjustments });
});

exports.getAdjustment = asyncHandler(async (req, res) => {
  const adjustment = await StockAdjustment.findById(req.params.id);
  res.status(200).json({ success: true, data: adjustment });
});

exports.createAdjustment = asyncHandler(async (req, res) => {
  const adjustment = await StockAdjustment.create({ ...req.body, created_by: req.user._id });
  res.status(201).json({ success: true, data: adjustment });
});

exports.updateAdjustment = asyncHandler(async (req, res) => {
  const adjustment = await StockAdjustment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ success: true, data: adjustment });
});

exports.cancelAdjustment = asyncHandler(async (req, res) => {
  const adjustment = await StockAdjustment.findById(req.params.id);
  adjustment.status = 'canceled';
  await adjustment.save();
  res.status(200).json({ success: true, data: adjustment });
});

exports.validateAdjustment = asyncHandler(async (req, res) => {
  const adj = await StockAdjustment.findById(req.params.id)
    .populate('product_id location_id warehouse_id');

  if (!adj || adj.status !== 'draft') {
    return res.status(400).json({ success: false, message: 'Invalid state or Adjustment not found' });
  }

  const stockLevel = await StockLevel.findOne({ product_id: adj.product_id._id, location_id: adj.location_id._id });
  if (!stockLevel) {
    return res.status(404).json({ success: false, message: 'System StockLevel location not found' });
  }

  const quantity_before = stockLevel.quantity;
  stockLevel.quantity = adj.counted_qty;
  await stockLevel.save();

  await StockMove.create({
    move_type: adj.difference > 0 ? 'adjustment_increase' : 'adjustment_decrease',
    product_id: adj.product_id._id,
    product_name: adj.product_id.name,
    product_sku: adj.product_id.sku,
    from_location_id: adj.location_id._id,
    from_location_name: adj.location_id.name,
    from_warehouse_name: adj.warehouse_id.name,
    to_location_id: adj.location_id._id,
    to_location_name: adj.location_id.name,
    to_warehouse_name: adj.warehouse_id.name,
    quantity: Math.abs(adj.difference),
    quantity_before: quantity_before,
    quantity_after: adj.counted_qty,
    reference_type: 'StockAdjustment',
    reference_id: adj._id,
    reference_number: adj.adjustment_number,
    created_by: req.user._id,
    created_by_name: req.user.full_name
  });

  adj.status = 'validated';
  adj.validated_at = new Date();
  adj.validated_by = req.user._id;
  await adj.save();

  await AuditLog.create({
    user_id: req.user._id,
    user_name: req.user.full_name,
    action: 'validated',
    module: 'Adjustments',
    record_id: adj._id,
    record_reference: adj.adjustment_number
  });

  res.status(200).json({ success: true, data: adj });
});
