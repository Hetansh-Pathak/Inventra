const asyncHandler = require('express-async-handler');
const StockMove = require('../models/StockMove');
const ReorderRule = require('../models/ReorderRule');
const Receipt = require('../models/Receipt');
const DeliveryOrder = require('../models/DeliveryOrder');

exports.getStats = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: { activeProducts: 120, totalValue: 45000, pendingDeliveries: 5 } });
});

exports.getMovementChart = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: [] });
});

exports.getCategoriesChart = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: [] });
});

exports.getValueChart = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: [] });
});

exports.getRecentActivity = asyncHandler(async (req, res) => {
  const moves = await StockMove.find().sort('-createdAt').limit(10);
  res.status(200).json({ success: true, data: moves });
});

exports.getLowStockAlerts = asyncHandler(async (req, res) => {
  const alerts = await ReorderRule.find({ last_triggered_at: { $ne: null } }).populate('product_id location_id');
  res.status(200).json({ success: true, data: alerts });
});

exports.getPendingOps = asyncHandler(async (req, res) => {
  const pendingReceipts = await Receipt.find({ status: 'confirmed' });
  const pendingDeliveries = await DeliveryOrder.find({ status: 'packed' });
  res.status(200).json({ success: true, data: { receipts: pendingReceipts, deliveries: pendingDeliveries } });
});
