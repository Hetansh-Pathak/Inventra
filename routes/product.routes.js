const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct,
  getProductStock, getProductMoves, getLowStockProducts, getOutOfStockProducts
} = require('../controllers/product.controller');

router.use(protect);

router.get('/low-stock', getLowStockProducts);
router.get('/out-of-stock', getOutOfStockProducts);

router.route('/')
  .get(getProducts)
  .post(authorize('admin', 'manager'), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(authorize('admin', 'manager'), updateProduct)
  .delete(authorize('admin'), deleteProduct);

router.get('/:id/stock', getProductStock);
router.get('/:id/moves', getProductMoves);

module.exports = router;
