// src/routes/handlers.js
import express from "express";
import pool from "../db.js"; // your pg pool

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, phone, experience, specialization, location, gps } = req.body;

  // Basic validation
  if (!name || !email || !phone) {
    return res.status(400).json({ success: false, message: "name, email and phone are required" });
  }

  try {
    const insertQuery = `
      INSERT INTO handlers (name, email, phone, experience, specialization, location, gps, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,'pending')
      RETURNING id, name, email, phone, experience, specialization, location, gps, status, created_at
    `;
    const values = [name, email, phone, experience || null, specialization || null, location || null, gps || null];

    const result = await pool.query(insertQuery, values);
    const handler = result.rows[0];

    return res.json({ success: true, handler });
  } catch (err) {
    console.error("DB Error:", err);

    // unique constraint on email -> Postgres error code 23505
    if (err.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "A handler with this email already exists. If this is you, contact admin."
      });
    }

    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;