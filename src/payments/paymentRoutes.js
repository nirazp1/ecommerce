const express = require('express');
const paymentController = require('./paymentController');

const router = express.Router();

router.post('/process', paymentController.processPayment);

module.exports = router;
