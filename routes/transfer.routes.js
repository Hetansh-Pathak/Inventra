const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getTransfers, getTransfer, createTransfer, updateTransfer, cancelTransfer,
  confirmTransfer, validateTransfer
} = require('../controllers/transfer.controller');

router.use(protect);

router.route('/')
  .get(getTransfers)
  .post(createTransfer);

router.route('/:id')
  .get(getTransfer)
  .put(updateTransfer);

router.post('/:id/cancel', cancelTransfer);
router.post('/:id/confirm', confirmTransfer);
router.post('/:id/validate', validateTransfer);

module.exports = router;
