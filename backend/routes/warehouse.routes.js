const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse,
  getLocations, addLocation, updateLocation, deleteLocation
} = require('../controllers/warehouse.controller');

router.use(protect);

router.route('/')
  .get(getWarehouses)
  .post(authorize('admin', 'manager'), createWarehouse);

router.route('/:id')
  .put(authorize('admin', 'manager'), updateWarehouse)
  .delete(authorize('admin'), deleteWarehouse);

router.route('/:id/locations')
  .get(getLocations)
  .post(authorize('admin', 'manager'), addLocation);

router.route('/locations/:locId')
  .put(authorize('admin', 'manager'), updateLocation)
  .delete(authorize('admin'), deleteLocation);

module.exports = router;
