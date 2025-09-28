// backend/src/utils/emailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// simple sendEmail helper
export async function sendEmail({ to, subject, html, text }) {
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text: text || undefined,
    html: html || undefined,
  });
  return info;
}