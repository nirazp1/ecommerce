const express = require('express');
const router = express.Router();

router.get('/name', (req, res) => {
  res.json({ name: 'My Awesome Wholesale Store' });
});

module.exports = router;
