const asyncHandler = require('express-async-handler');
const Warehouse = require('../models/Warehouse');
const Location = require('../models/Location');

exports.getWarehouses = asyncHandler(async (req, res) => {
  const warehouses = await Warehouse.find({ is_active: true });
  res.status(200).json({ success: true, data: warehouses });
});

exports.createWarehouse = asyncHandler(async (req, res) => {
  const warehouse = await Warehouse.create({ ...req.body, created_by: req.user._id });
  res.status(201).json({ success: true, data: warehouse });
});

exports.updateWarehouse = asyncHandler(async (req, res) => {
  const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ success: true, data: warehouse });
});

exports.deleteWarehouse = asyncHandler(async (req, res) => {
  const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, { is_active: false }, { new: true });
  res.status(200).json({ success: true, data: {} });
});

exports.getLocations = asyncHandler(async (req, res) => {
  const locations = await Location.find({ warehouse_id: req.params.id, is_active: true });
  res.status(200).json({ success: true, data: locations });
});

exports.addLocation = asyncHandler(async (req, res) => {
  const location = await Location.create({ ...req.body, warehouse_id: req.params.id });
  res.status(201).json({ success: true, data: location });
});

exports.updateLocation = asyncHandler(async (req, res) => {
  const location = await Location.findByIdAndUpdate(req.params.locId, req.body, { new: true });
  res.status(200).json({ success: true, data: location });
});

exports.deleteLocation = asyncHandler(async (req, res) => {
  const location = await Location.findByIdAndUpdate(req.params.locId, { is_active: false }, { new: true });
  res.status(200).json({ success: true, data: {} });
});
