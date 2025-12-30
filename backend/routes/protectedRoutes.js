const express = require('express');
const router = express.Router();
const requireSession = require('../middleware/requireSession');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db/db.json');

function readDB() {
  return JSON.parse(fs.readFileSync(dbPath));
}

router.get('/me', requireSession, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });

  res.json({
    message: 'Dostęp przyznany',
    email: user.email
  });
});

module.exports = router;