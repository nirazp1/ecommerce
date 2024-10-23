const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const productController = require('../controllers/productController');
const { authenticateToken } = require('../auth/authController');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/favorites', authenticateToken, productController.getFavoriteProducts);

module.exports = router;
