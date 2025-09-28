// backend/src/utils/emailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
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

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email send result:", info);
    return info;
  } catch (err) {
    console.error("❌ Email send error:", err);
    throw err;
  }
}