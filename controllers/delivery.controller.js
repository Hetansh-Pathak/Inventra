const asyncHandler = require('express-async-handler');
const DeliveryOrder = require('../models/DeliveryOrder');
const StockLevel = require('../models/StockLevel');
const StockMove = require('../models/StockMove');
const ReorderRule = require('../models/ReorderRule');
const AuditLog = require('../models/AuditLog');

// Placeholders
exports.getDeliveries = asyncHandler(async (req, res) => {
  const deliveries = await DeliveryOrder.find();
  res.status(200).json({ success: true, data: deliveries });
});

exports.getDelivery = asyncHandler(async (req, res) => {
  const delivery = await DeliveryOrder.findById(req.params.id);
  res.status(200).json({ success: true, data: delivery });
});

exports.createDelivery = asyncHandler(async (req, res) => {
  const delivery = await DeliveryOrder.create({ ...req.body, created_by: req.user._id });
  res.status(201).json({ success: true, data: delivery });
});

exports.updateDelivery = asyncHandler(async (req, res) => {
  const delivery = await DeliveryOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ success: true, data: delivery });
});

exports.cancelDelivery = asyncHandler(async (req, res) => {
  const delivery = await DeliveryOrder.findById(req.params.id);
  delivery.status = 'canceled';
  delivery.canceled_at = new Date();
  await delivery.save();
  res.status(200).json({ success: true, data: delivery });
});

exports.readyDelivery = asyncHandler(async (req, res) => {
  const delivery = await DeliveryOrder.findById(req.params.id);
  delivery.status = 'ready';
  delivery.ready_at = new Date();
  await delivery.save();
  res.status(200).json({ success: true, data: delivery });
});

exports.pickDelivery = asyncHandler(async (req, res) => {
  const delivery = await DeliveryOrder.findById(req.params.id);
  delivery.status = 'picked';
  delivery.picked_at = new Date();
  await delivery.save();
  res.status(200).json({ success: true, data: delivery });
});

exports.packDelivery = asyncHandler(async (req, res) => {
  const delivery = await DeliveryOrder.findById(req.params.id);
  delivery.status = 'packed';
  delivery.packed_at = new Date();
  await delivery.save();
  res.status(200).json({ success: true, data: delivery });
});

exports.validateDelivery = asyncHandler(async (req, res) => {
  const delivery = await DeliveryOrder.findById(req.params.id)
    .populate({ path: 'lines.product_id', select: 'name sku' })
    .populate({ path: 'lines.location_id', select: 'name' });

  if (!delivery || delivery.status !== 'packed') {
    return res.status(400).json({ success: false, message: 'Delivery must be fully packed' });
  }

  for (const line of delivery.lines) {
    const stockLevel = await StockLevel.findOne({
      product_id: line.product_id._id,
      location_id: line.location_id._id
    });

    if (!stockLevel || stockLevel.quantity < line.picked_qty) {
      return res.status(400).json({ success: false, message: `Insufficient stock for ${line.product_id.name}` });
    }

    const quantity_before = stockLevel.quantity;
    stockLevel.quantity -= line.picked_qty;
    stockLevel.last_updated_by = req.user._id;
    await stockLevel.save();

    await StockMove.create({
      move_type: 'delivery',
      product_id: line.product_id._id,
      product_name: line.product_id.name,
      product_sku: line.product_id.sku,
      from_location_id: line.location_id._id,
      from_location_name: line.location_id.name,
      from_warehouse_name: "Internal Warehouse",
      quantity: line.picked_qty,
      quantity_before,
      quantity_after: stockLevel.quantity,
      reference_type: 'DeliveryOrder',
      reference_id: delivery._id,
      reference_number: delivery.delivery_number,
      created_by: req.user._id,
      created_by_name: req.user.full_name
    });

    const reorderRule = await ReorderRule.findOne({ product_id: line.product_id._id, location_id: line.location_id._id });
    if (reorderRule && stockLevel.quantity < reorderRule.min_quantity) {
      reorderRule.last_triggered_at = new Date();
      await reorderRule.save();
    }
  }

  delivery.status = 'done';
  delivery.done_at = new Date();
  delivery.validated_by = req.user._id;
  await delivery.save();

  await AuditLog.create({
    user_id: req.user._id,
    user_name: req.user.full_name,
    action: 'validated',
    module: 'Deliveries',
    record_id: delivery._id,
    record_reference: delivery.delivery_number
  });

  res.status(200).json({ success: true, data: delivery });
});
