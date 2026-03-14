const asyncHandler = require('express-async-handler');
const Receipt = require('../models/Receipt');
const StockLevel = require('../models/StockLevel');
const StockMove = require('../models/StockMove');
const ReorderRule = require('../models/ReorderRule');
const AuditLog = require('../models/AuditLog');

// Placeholder generics
exports.getReceipts = asyncHandler(async (req, res) => {
  const receipts = await Receipt.find().populate('supplier_id');
  res.status(200).json({ success: true, data: receipts });
});

exports.getReceipt = asyncHandler(async (req, res) => {
  const receipt = await Receipt.findById(req.params.id).populate('supplier_id lines.product_id');
  res.status(200).json({ success: true, data: receipt });
});

exports.createReceipt = asyncHandler(async (req, res) => {
  const receipt = await Receipt.create({ ...req.body, created_by: req.user._id });
  res.status(201).json({ success: true, data: receipt });
});

exports.updateReceipt = asyncHandler(async (req, res) => {
  const receipt = await Receipt.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ success: true, data: receipt });
});

exports.cancelReceipt = asyncHandler(async (req, res) => {
  const receipt = await Receipt.findById(req.params.id);
  receipt.status = 'canceled';
  receipt.canceled_at = new Date();
  await receipt.save();
  res.status(200).json({ success: true, data: receipt });
});

exports.confirmReceipt = asyncHandler(async (req, res) => {
  const receipt = await Receipt.findById(req.params.id);
  receipt.status = 'confirmed';
  receipt.confirmed_at = new Date();
  receipt.confirmed_by = req.user._id;
  await receipt.save();
  res.status(200).json({ success: true, data: receipt });
});

exports.doneReceipt = asyncHandler(async (req, res) => {
  const receipt = await Receipt.findById(req.params.id);
  receipt.status = 'done';
  receipt.done_at = new Date();
  await receipt.save();
  res.status(200).json({ success: true, data: receipt });
});

exports.validateReceipt = asyncHandler(async (req, res) => {
  const receipt = await Receipt.findById(req.params.id)
    .populate({ path: 'lines.product_id', select: 'name sku' })
    .populate({ path: 'lines.location_id', select: 'name warehouse_id', populate: { path: 'warehouse_id', select: 'name' } });

  if (!receipt) {
    return res.status(404).json({ success: false, message: 'Receipt not found' });
  }

  if (receipt.status !== 'confirmed') {
    return res.status(400).json({ success: false, message: 'Receipt must be in confirmed status' });
  }

  for (const line of receipt.lines) {
    let stockLevel = await StockLevel.findOne({
      product_id: line.product_id._id,
      location_id: line.location_id._id
    });

    if (!stockLevel) {
      stockLevel = new StockLevel({
        product_id: line.product_id._id,
        location_id: line.location_id._id,
        warehouse_id: line.location_id.warehouse_id._id,
        quantity: 0
      });
    }

    const quantity_before = stockLevel.quantity;
    stockLevel.quantity += line.received_qty;
    stockLevel.last_updated_by = req.user._id;
    await stockLevel.save();

    await StockMove.create({
      move_type: 'receipt',
      product_id: line.product_id._id,
      product_name: line.product_id.name,
      product_sku: line.product_id.sku,
      to_location_id: line.location_id._id,
      to_location_name: line.location_id.name,
      to_warehouse_name: line.location_id.warehouse_id.name,
      quantity: line.received_qty,
      quantity_before,
      quantity_after: stockLevel.quantity,
      reference_type: 'Receipt',
      reference_id: receipt._id,
      reference_number: receipt.receipt_number,
      created_by: req.user._id,
      created_by_name: req.user.full_name
    });

    const reorderRule = await ReorderRule.findOne({ product_id: line.product_id._id, location_id: line.location_id._id });
    if (reorderRule && stockLevel.quantity >= reorderRule.min_quantity) {
      reorderRule.last_triggered_at = null;
      await reorderRule.save();
    }
  }

  receipt.status = 'validated';
  receipt.validated_at = new Date();
  receipt.validated_by = req.user._id;
  await receipt.save();

  await AuditLog.create({
    user_id: req.user._id,
    user_name: req.user.full_name,
    action: 'validated',
    module: 'Receipts',
    record_id: receipt._id,
    record_reference: receipt.receipt_number
  });

  res.status(200).json({ success: true, data: receipt });
});
