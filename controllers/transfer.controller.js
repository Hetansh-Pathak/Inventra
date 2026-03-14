const asyncHandler = require('express-async-handler');
const InternalTransfer = require('../models/InternalTransfer');
const StockLevel = require('../models/StockLevel');
const StockMove = require('../models/StockMove');
const AuditLog = require('../models/AuditLog');

exports.getTransfers = asyncHandler(async (req, res) => {
  const transfers = await InternalTransfer.find();
  res.status(200).json({ success: true, data: transfers });
});

exports.getTransfer = asyncHandler(async (req, res) => {
  const transfer = await InternalTransfer.findById(req.params.id);
  res.status(200).json({ success: true, data: transfer });
});

exports.createTransfer = asyncHandler(async (req, res) => {
  const transfer = await InternalTransfer.create({ ...req.body, created_by: req.user._id });
  res.status(201).json({ success: true, data: transfer });
});

exports.updateTransfer = asyncHandler(async (req, res) => {
  const transfer = await InternalTransfer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ success: true, data: transfer });
});

exports.cancelTransfer = asyncHandler(async (req, res) => {
  const transfer = await InternalTransfer.findById(req.params.id);
  transfer.status = 'canceled';
  transfer.canceled_at = new Date();
  await transfer.save();
  res.status(200).json({ success: true, data: transfer });
});

exports.confirmTransfer = asyncHandler(async (req, res) => {
  const transfer = await InternalTransfer.findById(req.params.id);
  transfer.status = 'ready';
  transfer.confirmed_at = new Date();
  await transfer.save();
  res.status(200).json({ success: true, data: transfer });
});

exports.validateTransfer = asyncHandler(async (req, res) => {
  const transfer = await InternalTransfer.findById(req.params.id)
     .populate({ path: 'lines.product_id', select: 'name sku' })
     .populate('from_location_id to_location_id from_warehouse_id to_warehouse_id');

  if (!transfer || transfer.status !== 'ready') {
    return res.status(400).json({ success: false, message: 'Transfer must be ready' });
  }

  for (const line of transfer.lines) {
    const fromStock = await StockLevel.findOne({ product_id: line.product_id._id, location_id: transfer.from_location_id._id });
    if (!fromStock || fromStock.quantity < line.quantity) {
      return res.status(400).json({ success: false, message: `Insufficient stock of ${line.product_id.name} at source!`});
    }

    let toStock = await StockLevel.findOne({ product_id: line.product_id._id, location_id: transfer.to_location_id._id });
    if (!toStock) {
      toStock = new StockLevel({
        product_id: line.product_id._id,
        location_id: transfer.to_location_id._id,
        warehouse_id: transfer.to_warehouse_id._id,
        quantity: 0
      });
    }

    const qty_before_from = fromStock.quantity;
    fromStock.quantity -= line.quantity;
    fromStock.last_updated_by = req.user._id;
    await fromStock.save();

    await StockMove.create({
      move_type: 'transfer_out',
      product_id: line.product_id._id,
      product_name: line.product_id.name,
      product_sku: line.product_id.sku,
      from_location_id: transfer.from_location_id._id,
      from_location_name: transfer.from_location_id.name,
      from_warehouse_name: transfer.from_warehouse_id.name,
      quantity: line.quantity,
      quantity_before: qty_before_from,
      quantity_after: fromStock.quantity,
      reference_type: 'InternalTransfer',
      reference_id: transfer._id,
      reference_number: transfer.transfer_number,
      created_by: req.user._id,
      created_by_name: req.user.full_name
    });

    const qty_before_to = toStock.quantity;
    toStock.quantity += line.quantity;
    toStock.last_updated_by = req.user._id;
    await toStock.save();

    await StockMove.create({
      move_type: 'transfer_in',
      product_id: line.product_id._id,
      product_name: line.product_id.name,
      product_sku: line.product_id.sku,
      to_location_id: transfer.to_location_id._id,
      to_location_name: transfer.to_location_id.name,
      to_warehouse_name: transfer.to_warehouse_id.name,
      quantity: line.quantity,
      quantity_before: qty_before_to,
      quantity_after: toStock.quantity,
      reference_type: 'InternalTransfer',
      reference_id: transfer._id,
      reference_number: transfer.transfer_number,
      created_by: req.user._id,
      created_by_name: req.user.full_name
    });
  }

  transfer.status = 'done';
  transfer.done_at = new Date();
  transfer.validated_by = req.user._id;
  await transfer.save();

  await AuditLog.create({
    user_id: req.user._id,
    user_name: req.user.full_name,
    action: 'validated',
    module: 'Transfers',
    record_id: transfer._id,
    record_reference: transfer.transfer_number
  });

  res.status(200).json({ success: true, data: transfer });
});
