// backend/src/utils/emailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Simple check if Gmail connection works
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Gmail transporter error:", err.message);
  } else {
    console.log("✅ Gmail transporter ready:", success);
  }
});

export async function sendApprovalEmail(email, resetToken) {
  const resetLink = `${process.env.FRONTEND_URL}/set-password/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "✅ VenomVision - Account Approved",
    html: `
      <h2>Welcome to VenomVision!</h2>
      <p>Your handler account has been approved.</p>
      <p>Please set your password here: <a href="${resetLink}">${resetLink}</a></p>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("📧 Gmail approval email sent:", info.messageId);
  return info;
}