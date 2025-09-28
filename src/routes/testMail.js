import express from "express";
import { sendApprovalEmail } from "../utils/emailer.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { to } = req.body;
  try {
    await sendApprovalEmail(to, "dummy-reset-token");
    res.json({ success: true, message: `📧 Test mail sent to ${to}` });
  } catch (err) {
    console.error("Test mail error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;   // ✅ Default export