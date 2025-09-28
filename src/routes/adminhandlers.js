// backend/src/routes/adminHandlers.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

// Approve a handler
router.put("/handlers/:id/approve", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE handlers SET status = 'approved' WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Handler not found" });
    }

    res.json({ success: true, handler: result.rows[0] });
  } catch (err) {
    console.error("DB Error (approve):", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Reject a handler
router.put("/handlers/:id/reject", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE handlers SET status = 'rejected' WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Handler not found" });
    }

    res.json({ success: true, handler: result.rows[0] });
  } catch (err) {
    console.error("DB Error (reject):", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get all pending handlers
router.get("/handlers/pending", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM handlers WHERE status = 'pending'");
    res.json({ success: true, handlers: result.rows });
  } catch (err) {
    console.error("DB Error (list pending):", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;