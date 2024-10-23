const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
