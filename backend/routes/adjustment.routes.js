const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getAdjustments, getAdjustment, createAdjustment, updateAdjustment, cancelAdjustment,
  validateAdjustment
} = require('../controllers/adjustment.controller');

router.use(protect);

router.route('/')
  .get(getAdjustments)
  .post(createAdjustment);

router.route('/:id')
  .get(getAdjustment)
  .put(updateAdjustment);

router.post('/:id/cancel', cancelAdjustment);
router.post('/:id/validate', validateAdjustment);

module.exports = router;
