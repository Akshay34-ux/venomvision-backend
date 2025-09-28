// backend/src/routes/adminHandlers.js
import express from "express";
import pool from "../db.js";
import crypto from "crypto";
import { sendEmail } from "../utils/emailer.js";

const router = express.Router();

// Approve handler - generates token & emails them
router.put("/:id/approve", async (req, res) => {
  const { id } = req.params;

  try {
    // generate token and expiry (24 hours)
    const resetToken = crypto.randomUUID();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const result = await pool.query(
      `UPDATE handlers
       SET status = 'approved', reset_token = $1, reset_token_expires = $2
       WHERE id = $3
       RETURNING id, name, email, phone, status`,
      [resetToken, expires, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Handler not found" });
    }

    const handler = result.rows[0];

    // send email with link to set password
    const setPasswordUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/set-password/${resetToken}`;

    const html = `
      <p>Hi ${handler.name},</p>
      <p>Your handler application has been <strong>approved</strong> by VenomVision.</p>
      <p>Please set your login password using the link below. The link is valid for 24 hours.</p>
      <p><a href="${setPasswordUrl}">Set your password</a></p>
      <p>If you did not apply, ignore this email.</p>
      <p>— VenomVision Team</p>
    `;

    try {
      await sendEmail({
        to: handler.email,
        subject: "VenomVision — Set your password",
        html,
      });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
      // still succeed the approve step but report email issue to admin
      return res.json({
        success: true,
        handler,
        emailSent: false,
        message: "Approved but failed to send email.",
      });
    }

    res.json({ success: true, handler, emailSent: true });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Reject route stays same (or keep as is)
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
    res.json({ success: true, handler: result.rows[0] });
  } catch (err) {
    console.error("DB Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;