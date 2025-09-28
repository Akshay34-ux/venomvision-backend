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

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent:", info.response);
  } catch (err) {
    console.error("📧 Email error:", err);
  }
}