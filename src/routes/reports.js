import express from "express";
import pool from "../db.js";

const router = express.Router();

// Fetch all rescue reports
router.get("/list", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM rescues ORDER BY created_at DESC");
    res.json({ success: true, reports: result.rows });
  } catch (err) {
    console.error("DB Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;