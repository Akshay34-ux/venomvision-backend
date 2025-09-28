// backend/src/routes/adminHandlers.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

/**
 * ✅ Approve a handler
 * PUT /api/admin/handlers/:id/approve
 */
router.put("/handlers/:id/approve", async (req, res) => {
  const { id } = req.params;
  console.log("🔍 Approving handler ID:", id);

  try {
    const result = await pool.query(
      "UPDATE handlers SET status = 'approved' WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, handler: result.rows[0] });
    } else {
      res.status(404).json({ success: false, message: "Handler not found" });
    }
  } catch (err) {
    console.error("❌ Approve handler error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

/**
 * ❌ Reject a handler
 * PUT /api/admin/handlers/:id/reject
 */
router.put("/handlers/:id/reject", async (req, res) => {
  const { id } = req.params;
  console.log("🔍 Rejecting handler ID:", id);

  try {
    const result = await pool.query(
      "UPDATE handlers SET status = 'rejected' WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, handler: result.rows[0] });
    } else {
      res.status(404).json({ success: false, message: "Handler not found" });
    }
  } catch (err) {
    console.error("❌ Reject handler error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

/**
 * 📋 Get all handlers
 * GET /api/admin/handlers
 */
router.get("/handlers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM handlers ORDER BY created_at DESC");
    res.json({ success: true, handlers: result.rows });
  } catch (err) {
    console.error("❌ Fetch handlers error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

export default router;