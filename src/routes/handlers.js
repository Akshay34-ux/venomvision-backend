// backend/src/routes/handlers.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

// Register new handler
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, experience, specialization, location, gps } = req.body;

    const result = await pool.query(
      `INSERT INTO handlers (name, email, phone, experience, specialization, location, gps, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', NOW())
       RETURNING *`,
      [name, email, phone, experience, specialization, location, gps]
    );

    res.json({ success: true, handler: result.rows[0] });
  } catch (err) {
    console.error("Error registering handler:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all pending handlers (for admin)
router.get("/pending", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM handlers WHERE status = 'pending' ORDER BY created_at DESC`
    );
    res.json({ success: true, handlers: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Approve handler
router.patch("/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`UPDATE handlers SET status = 'approved' WHERE id = $1`, [id]);
    res.json({ success: true, message: "Handler approved" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Reject handler
router.patch("/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`UPDATE handlers SET status = 'rejected' WHERE id = $1`, [id]);
    res.json({ success: true, message: "Handler rejected" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;