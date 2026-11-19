const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");
const { signToken } = require("../utils/auth");

const router = express.Router();

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// POST /api/login  (email + password only)
router.post("/", async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  if (!isValidEmail(email) || !password) {
    return res.status(400).json({
      ok: false,
      message: "Email and password are required.",
    });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT id, full_name, email, age, category, course, password_hash
       FROM registrations
       WHERE email = :email
       LIMIT 1`,
      { email }
    );

    if (!rows.length || !rows[0].password_hash) {
      return res.status(401).json({
        ok: false,
        message: "Invalid email or password.",
      });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({
        ok: false,
        message: "Invalid email or password.",
      });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
    });

    return res.json({
      ok: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        age: user.age,
        category: user.category,
        course: user.course,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error. Please try again later.",
    });
  }
});

module.exports = router;
