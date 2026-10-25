const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const db = {};

app.use(express.json({ limit: '15mb' }));

io.on('connection', (socket) => {
  socket.on('join', (code) => socket.join(String(code).toUpperCase()));
});

app.post('/api/couple', (req, res) => {
  const { code, state } = req.body || {};
  if (!code || !state) return res.status(400).json({ error: 'Eksik veri' });
  const key = String(code).toUpperCase();
  db[key] = state;
  res.json({ ok: true, code: key });
});

app.get('/api/state/:code', (req, res) => {
  const key = String(req.params.code).toUpperCase();
  const state = db[key];
  if (!state) return res.status(404).json({ error: 'Böyle bir kod bulunamadı' });
  res.json({ state });
});

app.post('/api/state/:code', (req, res) => {
  const key = String(req.params.code).toUpperCase();
  const state = req.body?.state;
  if (!state) return res.status(400).json({ error: 'Eksik veri' });
  const existing = db[key];
  if (existing && existing.updatedAt > state.updatedAt) {
    return res.json({ ok: true, stale: true, state: existing });
  }
  db[key] = state;
  io.to(key).emit('state', state);
  res.json({ ok: true });
});

module.exports = app;
