const express = require('express');
const inventoryController = require('./inventoryController');

const router = express.Router();

router.post('/update', inventoryController.updateInventory);
router.post('/create', inventoryController.createProduct);
router.get('/products', inventoryController.getProducts);

module.exports = router;
