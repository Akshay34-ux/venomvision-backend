// backend/src/routes/adminHandlers.js
import express from "express";
import pool from "../db.js";
import { sendApprovalEmail } from "../utils/emailer.js"; // your nodemailer function

const router = express.Router();

// Approve handler
router.put("/handlers/:id/approve", async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Update DB
    const result = await pool.query(
      "UPDATE handlers SET status = 'approved' WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Handler not found" });
    }

    const handler = result.rows[0];

    // 2. Send email (try/catch so even if email fails, response is returned)
    try {
      await sendApprovalEmail(handler.email, handler.id);
    } catch (emailErr) {
      console.error("📧 Email error:", emailErr.message);
    }

    // 3. ✅ Respond back
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

export default router;