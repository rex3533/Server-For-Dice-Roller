import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

/**
 * Allow only your static site origin in CORS.
 * Example: https://<your-static>.azurestaticapps.net
 * You can comma-separate multiple origins if needed.
 */
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "";
const corsOk = ALLOWED_ORIGIN
  ? cors({ origin: ALLOWED_ORIGIN.split(",").map(s => s.trim()) })
  : cors(); // fallback: allow all (fine for local dev)

/** Helpers */
const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/** Static tester page (no UI for dice roller here) */
app.use(express.static("public"));

/** --- CORS-enabled APIs --- */
app.get("/api/ping", corsOk, (req, res) => {
  res.json({ ok: true, message: "pong", time: Date.now() });
});

app.get("/api/random", corsOk, (req, res) => {
  const min = Number(req.query.min ?? 1);
  const max = Number(req.query.max ?? 20);
  if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) {
    return res.status(400).json({ error: "Bad min/max" });
  }
  res.json({ n: randInt(min, max), min, max });
});

app.get("/api/d20", corsOk, (req, res) => {
  res.json({ n: randInt(1, 20) });
});

/** --- Intentionally NO CORS headers (CORS failure demo) --- */
app.get("/api/nocors", (req, res) => {
  res.json({ ok: true, note: "This route omits CORS headers on purpose." });
});

app.listen(PORT, () => {
  console.log(`Dice API listening on :${PORT}`);
});
