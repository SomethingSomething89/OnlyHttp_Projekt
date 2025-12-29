const express = require('express');
const router = express.Router();
const requireSession = require('../middleware/requireSession');

router.get('/me', requireSession, (req, res) => {
  res.json({
    message: 'Dostęp przyznany',
    userId: req.userId
  });
});

module.exports = router;
