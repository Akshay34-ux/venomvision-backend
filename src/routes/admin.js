import express from "express";

const router = express.Router();

// Temporary hardcoded admin credentials
const ADMIN = {
  email: "admin@venomvision.com",
  password: "admin123",
};

// POST /api/admin/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN.email && password === ADMIN.password) {
    return res.json({
      success: true,
      message: "✅ Admin login successful",
      token: "fake-jwt-token", // later replace with JWT
    });
  }

  return res.status(401).json({
    success: false,
    message: "❌ Invalid credentials",
  });
});

export default router;