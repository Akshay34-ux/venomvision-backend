// backend/src/utils/emailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true", // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendApprovalEmail(email, handlerId) {
  const resetLink = `${process.env.FRONTEND_URL}/set-password/${handlerId}`;

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

  await transporter.sendMail(mailOptions);
  console.log(`📧 Approval email sent to ${email}`);
}