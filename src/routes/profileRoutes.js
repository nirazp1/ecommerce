const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticateToken } = require('../auth/authController');

router.get('/', authenticateToken, (req, res, next) => {
  console.log('Profile route hit');
  next();
}, profileController.getProfile);

module.exports = router;
