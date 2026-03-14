const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const StockLevel = require('../models/StockLevel');
const StockMove = require('../models/StockMove');

exports.getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate('category_id');
  res.status(200).json({ success: true, data: products });
});

exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category_id');
  res.status(200).json({ success: true, data: product });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({ ...req.body, created_by: req.user._id });
  res.status(201).json({ success: true, data: product });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ success: true, data: product });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  product.is_active = false;
  await product.save();
  res.status(200).json({ success: true, data: {} });
});

exports.getProductStock = asyncHandler(async (req, res) => {
  const levels = await StockLevel.find({ product_id: req.params.id }).populate('location_id warehouse_id');
  res.status(200).json({ success: true, data: levels });
});

exports.getProductMoves = asyncHandler(async (req, res) => {
  const moves = await StockMove.find({ product_id: req.params.id }).sort('-createdAt');
  res.status(200).json({ success: true, data: moves });
});

exports.getLowStockProducts = asyncHandler(async (req, res) => {
  // Aggregate stock logic or specific querying via ReorderRules
  res.status(200).json({ success: true, data: [] });
});

exports.getOutOfStockProducts = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: [] });
});
