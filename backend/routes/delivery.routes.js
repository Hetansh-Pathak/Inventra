const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getDeliveries, getDelivery, createDelivery, updateDelivery, cancelDelivery,
  readyDelivery, pickDelivery, packDelivery, validateDelivery
} = require('../controllers/delivery.controller');

router.use(protect);

router.route('/')
  .get(getDeliveries)
  .post(createDelivery);

router.route('/:id')
  .get(getDelivery)
  .put(updateDelivery);

router.post('/:id/cancel', cancelDelivery);
router.post('/:id/ready', readyDelivery);
router.post('/:id/pick', pickDelivery);
router.post('/:id/pack', packDelivery);
router.post('/:id/validate', validateDelivery);

module.exports = router;
