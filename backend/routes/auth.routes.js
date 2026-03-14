const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { register, login, logout, getMe, getUsers } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.get('/users', protect, getUsers);

module.exports = router;
