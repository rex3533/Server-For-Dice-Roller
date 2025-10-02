import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 8080;

/* ---- CORS demo route WITHOUT CORS (registered BEFORE global cors) ---- */
app.get("/api/nocors", (req, res) => {
  res.json({ ok: true, note: "No CORS headers here on purpose." });
});

/* ---- Enable CORS for everyone (lab requires public access) ---- */
app.use(cors());  // Access-Control-Allow-Origin: *

/* ---- Static tester page (no Dice UI here) ---- */
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (_req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

/* ---- REST APIs ---- */
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

app.get("/api/ping", (_req, res) =>
  res.json({ ok: true, time: Date.now() })
);

app.get("/api/random", (req, res) => {
  const min = Number(req.query.min ?? 1);
  const max = Number(req.query.max ?? 20);
  if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) {
    return res.status(400).json({ error: "Bad min/max" });
  }
  res.json({ n: randInt(min, max), min, max });
});

app.get("/api/d20", (_req, res) => res.json({ n: randInt(1, 20) }));

/* ---- Start server (must use process.env.PORT on Azure) ---- */
app.listen(PORT, "0.0.0.0", () => console.log(`Listening on ${PORT}`));
