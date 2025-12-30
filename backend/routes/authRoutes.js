const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { hashPassword, comparePassword } = require('../utils/password');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '../db/db.json');

function readDB() {
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
}

function writeDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email i hasło są wymagane!' });

  if (!email.includes('@')) {
	return res.status (400).json({ message: 'Niepoprawny email!' });
  }

  if (password.length < 8) {
	return res.status(400).json({ message: 'Hasło musi mieć minimum 8 znaków!' });  
  }

  const db = readDB();

  if (db.users.find(u => u.email === email))
    return res.status(400).json({ message: 'Użytkownik już istnieje' });

  const passwordHash = await hashPassword(password);

  const newUser = {
    id: uuidv4(), 
    email,
    passwordHash
  };

  db.users.push(newUser);
  writeDB(db);

  res.status(201).json({ message: 'Użytkownik zarejestrowany' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email i hasło są wymagane' });

  const db = readDB();
  const user = db.users.find(u => u.email === email);

  if (!user) return res.status(401).json({ message: 'Niepoprawne dane logowania' });

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Niepoprawne dane logowania' });

  const sessionId = uuidv4();
  
  db.sessions = db.sessions.filter(s => s.userId !== user.id);
  
  const session = { id: sessionId, userId: user.id, expiresAt: Date.now() + 1000 * 60 * 60 };
  db.sessions.push(session);
  writeDB(db);

  res.cookie('sessionId', sessionId, { httpOnly: true });
  res.json({ message: 'Zalogowano' });
});

// Logout
router.post('/logout', (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) return res.status(400).json({ message: 'Brak sesji' });

  const db = readDB();
  db.sessions = db.sessions.filter(s => s.id !== sessionId);
  writeDB(db);

  res.clearCookie('sessionId');
  res.json({ message: 'Wylogowano' });
});

module.exports = router;
