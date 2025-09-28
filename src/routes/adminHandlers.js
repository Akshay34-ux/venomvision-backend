// backend/src/routes/adminHandlers.js
import express from "express";
import pool from "../db.js";
import { sendApprovalEmail } from "../utils/emailer.js"; // ✅ works now
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.put("/:id/approve", async (req, res) => {
  const { id } = req.params;

  try {
    const check = await pool.query("SELECT * FROM handlers WHERE id = $1", [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Handler not found" });
    }

    const handler = check.rows[0];
    if (handler.status === "approved") {
      return res.status(400).json({ success: false, message: "Handler is already approved" });
    }

    const resetToken = uuidv4();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const result = await pool.query(
      `UPDATE handlers
       SET status = 'approved',
           reset_token = $2,
           reset_token_expires = $3
       WHERE id = $1
       RETURNING *`,
      [id, resetToken, expires]
    );

    const updatedHandler = result.rows[0];

    try {
      await sendApprovalEmail(updatedHandler.email, updatedHandler.reset_token);
    } catch (emailErr) {
      console.error("📧 Email error:", emailErr.message);
    }

    return res.json({
      success: true,
      message: "Handler approved and email sent",
      handler: updatedHandler,
    });
  } catch (err) {
    console.error("DB Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;