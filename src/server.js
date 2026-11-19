const path = require("path");
const express = require("express");
const cors = require("cors");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");

const app = express();
const PORT = Number(process.env.PORT || 5000);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "OPTIONS"],
  })
);
app.use(express.json({ limit: "100kb" }));

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "eyai-registration-api",
    endpoints: {
      health: "GET /api/health",
      register: "POST /api/register",
      login: "POST /api/login",
      profile: "GET /api/register/me",
    },
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "eyai-registration-api" });
});

app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: `Route not found: ${req.method} ${req.path}`,
  });
});

const server = app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`);
  console.log(`   Health:   GET  /api/health`);
  console.log(`   Register: POST /api/register`);
  console.log(`   Login:    POST /api/login`);
  console.log(`   Profile:  GET  /api/register/me  (Bearer token)`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.error("   Run: fuser -k 5000/tcp   then   npm run dev");
    process.exit(1);
  }
  throw err;
});
