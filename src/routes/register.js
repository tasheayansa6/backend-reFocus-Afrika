const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");
const validateRegistration = require("../middleware/validateRegistration");
const requireAuth = require("../middleware/auth");
const { signToken } = require("../utils/auth");

const router = express.Router();

// POST /api/register
router.post("/", validateRegistration, async (req, res) => {
  const data = req.registration;

  try {
    const passwordHash = await bcrypt.hash(data.password, 10);

    const [result] = await pool.execute(
      `INSERT INTO registrations
        (full_name, age, gender, region, phone, email, education, occupation,
         category, course, level, interests, career_goal, mode, consent, password_hash)
       VALUES
        (:fullName, :age, :gender, :region, :phone, :email, :education, :occupation,
         :category, :course, :level, :interests, :careerGoal, :mode, :consent, :passwordHash)`,
      {
        fullName: data.fullName,
        age: data.age,
        gender: data.gender,
        region: data.region,
        phone: data.phone,
        email: data.email,
        education: data.education,
        occupation: data.occupation,
        category: data.category,
        course: data.course,
        level: data.level,
        interests: data.interests,
        careerGoal: data.careerGoal,
        mode: data.mode,
        consent: data.consent,
        passwordHash,
      }
    );

    const token = signToken({
      id: result.insertId,
      email: data.email,
      fullName: data.fullName,
    });

    return res.status(201).json({
      ok: true,
      message: "Registration received — we’ll be in touch.",
      id: result.insertId,
      token,
      user: {
        id: result.insertId,
        fullName: data.fullName,
        email: data.email,
        age: data.age,
        category: data.category,
        course: data.course,
      },
    });
  } catch (err) {
    if (err && err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        ok: false,
        message: "This email is already registered. Please log in.",
      });
    }

    console.error("Register error:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error. Please try again later.",
    });
  }
});

// GET /api/register/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
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
         created_at AS createdAt
       FROM registrations
       WHERE id = :id
       LIMIT 1`,
      { id: req.user.id }
    );

    if (!rows.length) {
      return res.status(404).json({ ok: false, message: "User not found." });
    }

    return res.json({ ok: true, user: rows[0] });
  } catch (err) {
    console.error("Profile error:", err);
    return res.status(500).json({ ok: false, message: "Server error." });
  }
});

module.exports = router;
