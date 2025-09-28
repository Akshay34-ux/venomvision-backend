// backend/src/utils/emailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send approval email with reset token
export async function sendApprovalEmail(email, resetToken) {
  const resetLink = `${process.env.FRONTEND_URL}/set-password/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM, // should be venomvision4all@gmail.com
    to: email,
    subject: "✅ VenomVision - Account Approved",
    html: `
      <h2>Welcome to VenomVision!</h2>
      <p>Your handler account has been approved 🎉</p>
      <p>Please click below to set your password (valid for 24 hours):</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Approval email sent to ${email}:`, info.response);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
    throw err;
  }
}