const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const { authenticateToken } = require('../auth/authController');

router.get('/profile', authenticateToken, sellerController.getSellerProfile);
router.get('/products', authenticateToken, sellerController.getSellerProducts);

module.exports = router;
