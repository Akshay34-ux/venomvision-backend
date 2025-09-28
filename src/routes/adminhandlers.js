// src/routes/adminHandlers.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

// List pending handlers
router.get("/handlers/pending", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM handlers WHERE status = 'pending' ORDER BY created_at DESC");
    res.json({ success: true, handlers: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Approve a handler (admin action)
router.put("/handlers/:id/approve", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "UPDATE handlers SET status = 'approved' WHERE id = $1 RETURNING *",
      [id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, handler: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;