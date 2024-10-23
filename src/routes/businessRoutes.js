const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const { authenticateToken } = require('../auth/authController');

router.post('/register-business', authenticateToken, businessController.registerBusiness);

module.exports = router;
