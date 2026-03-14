const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getStats, getMovementChart, getCategoriesChart, getValueChart,
  getRecentActivity, getLowStockAlerts, getPendingOps
} = require('../controllers/dashboard.controller');

router.use(protect);

router.get('/stats', getStats);
router.get('/chart/movement', getMovementChart);
router.get('/chart/categories', getCategoriesChart);
router.get('/chart/value', getValueChart);
router.get('/recent-activity', getRecentActivity);
router.get('/low-stock-alerts', getLowStockAlerts);
router.get('/pending-ops', getPendingOps);

module.exports = router;
