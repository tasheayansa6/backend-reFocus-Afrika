const express = require("express");
const pool = require("../db/pool");

const router = express.Router();

function requireAdmin(req, res, next) {
  const key = req.headers["x-admin-key"] || req.body?.adminKey || "";
  const expected = process.env.ADMIN_KEY || "eyai-admin-2026";

  if (!key || key !== expected) {
    return res.status(401).json({
      ok: false,
      message: "Admin access denied.",
    });
  }
  return next();
}

// POST /api/admin/login
router.post("/login", (req, res) => {
  const key = String(req.body?.adminKey || "");
  const expected = process.env.ADMIN_KEY || "eyai-admin-2026";

  if (!key || key !== expected) {
    return res.status(401).json({ ok: false, message: "Invalid admin key." });
  }

  return res.json({
    ok: true,
    message: "Admin login successful.",
    adminKey: expected,
  });
});

// GET /api/admin/registrations
router.get("/registrations", requireAdmin, async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         id,
         full_name AS fullName,
         age,
         gender,
         region,
         phone,
         email,
         education,
         occupation,
         category,
         course,
         level,
         interests,
         career_goal AS careerGoal,
         mode,
         consent,
         created_at AS createdAt
       FROM registrations
       ORDER BY created_at DESC`
    );

    return res.json({ ok: true, count: rows.length, data: rows });
  } catch (err) {
    console.error("Admin list error:", err);
    return res.status(500).json({ ok: false, message: "Server error." });
  }
});

module.exports = router;
