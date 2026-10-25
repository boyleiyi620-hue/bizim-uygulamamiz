import express from "express";
import http from "http";
import { Server } from "socket.io";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "data.json");
const PORT = process.env.PORT || 3001;

function loadData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return {};
  }
}

const db = loadData();

function saveData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db));
}

const app = express();
app.use(express.json({ limit: "15mb" }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("join", (code) => socket.join(String(code).toUpperCase()));
});

// Yeni çift oluştur / kod üret
app.post("/api/couple", (req, res) => {
  const { code, state } = req.body || {};
  if (!code || !state) return res.status(400).json({ error: "Eksik veri" });
  const key = String(code).toUpperCase();
  db[key] = state;
  saveData();
  res.json({ ok: true, code: key });
});

// Davet kodu ile katıl (durumu getir)
app.get("/api/state/:code", (req, res) => {
  const key = String(req.params.code).toUpperCase();
  const state = db[key];
  if (!state) return res.status(404).json({ error: "Böyle bir kod bulunamadı" });
  res.json({ state });
});

// Durumu kaydet (son yazan kazanır) + odaya broadcast
app.post("/api/state/:code", (req, res) => {
  const key = String(req.params.code).toUpperCase();
  const state = req.body?.state;
  if (!state) return res.status(400).json({ error: "Eksik veri" });
  const existing = db[key];
  if (existing && existing.updatedAt > state.updatedAt) {
    // sunucudaki daha taze
    return res.json({ ok: true, stale: true, state: existing });
  }
  db[key] = state;
  saveData();
  socketBroadcast(key, state);
  res.json({ ok: true });
});

function socketBroadcast(code, state) {
  io.to(code).emit("state", state);
}

// Üretim: derlenmiş uygulamayı sun
const dist = path.join(__dirname, "..", "dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (req, res) => res.sendFile(path.join(dist, "index.html")));
}

server.listen(PORT, () => console.log(`💘 API çalışıyor: http://localhost:${PORT}`));
