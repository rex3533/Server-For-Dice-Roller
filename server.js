import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 3000;

// CORS for  static site
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "https://kind-sea-003aaf510.2.azurestaticapps.net";
app.use(cors({ origin: ALLOWED_ORIGIN }));

// Serve the tester page from /public at the site root
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Minimal APIs
const rand = (a,b)=>Math.floor(Math.random()*(b-a+1))+a;
app.get("/api/ping", (_req,res)=>res.json({ ok:true, time:Date.now() }));
app.get("/api/random", (req,res)=>{
  const min=+req.query.min||1, max=+req.query.max||20;
  if (min>max) return res.status(400).json({error:"Bad min/max"});
  res.json({ n: rand(min,max), min, max });
});
// no CORS on purpose
app.get("/api/nocors", (req,res)=>{
  res.setHeader("Content-Type","application/json");
  res.end(JSON.stringify({ ok:true, note:"no CORS headers here" }));
});

app.listen(PORT, "0.0.0.0", ()=>console.log(`Listening on ${PORT}`));
