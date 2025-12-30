const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const requireSession = require('../middleware/requireSession');

const dbPath = path.join(__dirname, '../db/db.json');

function readDB() {
  return JSON.parse(fs.readFileSync(dbPath));
}

function writeDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

// GET
router.get('/my-items', requireSession, (req, res) => {
  const db = readDB();
  const userNotes = db.notes.filter(n => n.userId === req.userId);
  res.json(userNotes);
});

// POST
router.post('/my-items', requireSession, (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Brak treści notatki!' });

  const db = readDB();
  const newNote = {
    id: uuidv4(),
    userId: req.userId,
    text
  };
  db.notes.push(newNote);
  writeDB(db);

  res.status(201).json({ message: 'Notatka dodana!', note: newNote });
});

// PUT
router.put('/my-items/:id', requireSession, (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Brak treści notatki!' });

  const db = readDB();
  const note = db.notes.find(n => n.id === id);
  
  if (!note) return res.status(404).json({ message: 'Notatka nie znaleziona' });
  if (note.userId !== req.userId) return res.status(403).json({ message: 'Brak uprawnień' });

  note.text = text;
  writeDB(db);

  res.json({ message: 'Notatka edytowana!', note });
});

// DELETE
router.delete('/my-items/:id', requireSession, (req, res) => {
  const { id } = req.params;

  const db = readDB();
  const noteIndex = db.notes.findIndex(n => n.id === id);
  if (noteIndex === -1) return res.status(404).json({ message: 'Notatka nie znaleziona' });
  if (db.notes[noteIndex].userId !== req.userId) return res.status(403).json({ message: 'Brak uprawnień' });

  db.notes.splice(noteIndex, 1);
  writeDB(db);

  res.json({ message: 'Notatka usunięta!' });
});

module.exports = router;