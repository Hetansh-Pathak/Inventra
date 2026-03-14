const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getReceipts, getReceipt, createReceipt, updateReceipt, cancelReceipt,
  confirmReceipt, validateReceipt, doneReceipt
} = require('../controllers/receipt.controller');

router.use(protect);

router.route('/')
  .get(getReceipts)
  .post(createReceipt);

router.route('/:id')
  .get(getReceipt)
  .put(updateReceipt)
  .delete(cancelReceipt);

router.post('/:id/confirm', confirmReceipt);
router.post('/:id/validate', validateReceipt);
router.post('/:id/done', doneReceipt);

module.exports = router;
