// backend/src/routes/adminHandlers.js
import express from "express";
import pool from "../db.js";
import { sendApprovalEmail } from "../utils/emailer.js";

const router = express.Router();

// Approve handler
router.put("/:id/approve", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE handlers SET status = 'approved' WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Handler not found" });
    }

    const handler = result.rows[0];

    try {
      await sendApprovalEmail(handler.email, handler.id);
    } catch (emailErr) {
      console.error("📧 Email error:", emailErr.message);
    }

    return res.json({
      success: true,
      message: "Handler approved and email sent",
      handler,
    });
  } catch (err) {
    console.error("DB Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Reject handler
router.put("/:id/reject", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE handlers SET status = 'rejected' WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Handler not found" });
    }

    return res.json({ success: true, handler: result.rows[0] });
  } catch (err) {
    console.error("DB Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;