// backend/src/utils/emailer.js
import nodemailer from "nodemailer";

// ✅ create reusable transporter object
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
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

// ✅ optional: test mail function
export async function sendTestMail(to) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: "📧 Test Email from VenomVision",
    text: "If you see this, your SMTP setup is working! 🚀",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Test mail result:", info);
    return info;
  } catch (err) {
    console.error("❌ Test mail error:", err);
    throw err;
  }
}