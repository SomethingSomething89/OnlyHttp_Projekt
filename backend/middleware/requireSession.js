const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db/db.json');

function readDB() {
  return JSON.parse(fs.readFileSync(dbPath));
}

function requireSession(req, res, next) {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.status(401).json({ message: 'Brak sesji' });
  }

  const db = readDB();
  const session = db.sessions.find(s => s.id === sessionId);

  if (!session) {
    return res.status(401).json({ message: 'Nieprawidłowa sesja' });
  }

  req.userId = session.userId;
  next();
}

module.exports = requireSession;
