const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const notes = require('./routes/notes');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api', notes);

app.get('/api/test', (req, res) => res.send('Backend działa!'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Serwer działa na http://localhost:${PORT}`));
