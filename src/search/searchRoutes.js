const express = require('express');
const searchController = require('./searchController');

const router = express.Router();

router.get('/products', searchController.searchProducts);

module.exports = router;
