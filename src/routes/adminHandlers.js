// backend/src/routes/adminHandlers.js
import express from "express";
import pool from "../db.js";
import { sendApprovalEmail } from "../utils/emailer.js";
import { v4 as uuidv4 } from "uuid"; // generate reset tokens

const router = express.Router();

// Approve handler
router.put("/:id/approve", async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Generate reset token (valid for 24 hours)
    const resetToken = uuidv4();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // 2. Update handler in DB
    const result = await pool.query(
      `UPDATE handlers
       SET status = 'approved',
           reset_token = $2,
           reset_token_expires = $3
       WHERE id = $1
       RETURNING *`,
      [id, resetToken, expires]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Handler not found" });
    }

    const handler = result.rows[0];

    // 3. Send email
    try {
      await sendApprovalEmail(handler.email, handler.reset_token);
    } catch (emailErr) {
      console.error("📧 Email error:", emailErr.message);
    }

    // 4. Respond
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