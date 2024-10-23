const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken } = require('../auth/authController');

router.get('/recent', authenticateToken, orderController.getRecentOrders);

module.exports = router;
