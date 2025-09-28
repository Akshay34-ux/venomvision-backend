// backend/src/routes/handlerAuth.js
import express from "express";
import pool from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Set password using token
router.post("/set-password/:token", async (req, res) => {
  const token = req.params.token;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, message: "Password length must be >= 6" });
  }

  try {
    const result = await pool.query(
      `SELECT id, reset_token_expires FROM handlers WHERE reset_token = $1`,
      [token]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    const row = result.rows[0];
    const expires = row.reset_token_expires;
    if (!expires || new Date(expires) < new Date()) {
      return res.status(400).json({ success: false, message: "Token expired" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // update password and clear reset token
    await pool.query(
      `UPDATE handlers SET password = $1, reset_token = NULL, reset_token_expires = NULL
       WHERE id = $2`,
      [hashed, row.id]
    );

    res.json({ success: true, message: "Password set. You may now login." });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login for handlers
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT id, name, email, password, status FROM handlers WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const handler = result.rows[0];

    // check approved
    if (handler.status !== "approved") {
      return res.status(403).json({ success: false, message: "Account not approved" });
    }

    if (!handler.password) {
      return res.status(403).json({ success: false, message: "Password not set. Check email." });
    }

    const match = await bcrypt.compare(password, handler.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // create JWT
    const token = jwt.sign(
      { id: handler.id, email: handler.email, role: "handler" },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      handler: { id: handler.id, name: handler.name, email: handler.email },
    });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;