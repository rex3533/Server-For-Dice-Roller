const express = require('express');
const cors = require('cors');
const path = require('path');
const url = require('url');

const app = express();
const port = process.env.PORT || 3000;

/* ---------- Route with NO CORS (for failure demo) ----------
   Order matters: define this BEFORE global app.use(cors())     */
app.get('/api/nocors', (req, res) => {
  res.type('application/json');
  res.send(JSON.stringify({ ok: true, note: 'No CORS headers here (intentional).' }));
});

/* ---------- Open CORS for everyone (lab requires public access) ---------- */
app.use(cors({ origin: '*' }));

/* ---------- Static tester page (no dice UI here) ---------- */
app.use(express.static(path.join(__dirname, 'static')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

/* ---------- REST APIs ---------- */
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

app.get('/api/ping', (req, res) => {
  console.log('GET /api/ping');
  res.type('application/json');
  res.send(JSON.stringify({ ok: true, time: Date.now() }));
});

app.get('/api/random', (req, res) => {
  console.log('GET /api/random', req.url);
  const q = url.parse(req.url, true).query;
  const min = Number(q.min ?? 1);
  const max = Number(q.max ?? 20);
  if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) {
    res.status(400).json({ error: 'Bad min/max' });
    return;
  }
  res.json({ n: randInt(min, max), min, max });
});

app.get('/api/d20', (req, res) => {
  res.json({ n: randInt(1, 20) });
});

/* ---------- 404 / 500 like your previous app ---------- */
app.use((req, res) => {
  res.type('text/plain');
  res.status(404).send('404 - Not Found');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.type('text/plain');
  res.status(500).send('500 - Server Error');
});

/* ---------- Start server (Azure needs process.env.PORT) ---------- */
app.listen(port, () => {
  console.log(`Express started at "http://localhost:${port}"\npress Ctrl-C to terminate.`);
});
