import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM admins WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length > 0) {
      res.json({
        success: true,
        message: "✅ Admin login successful",
        token: "fake-jwt-token", // later we’ll replace with real JWT
      });
    } else {
      res.status(401).json({
        success: false,
        message: "❌ Invalid credentials",
      });
    }
  } catch (err) {
    console.error("DB Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;