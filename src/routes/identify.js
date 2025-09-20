// backend/src/routes/identify.js
import express from "express";
import multer from "multer";
import path from "path";
import { analyzeImage } from "../services/geminiService.js";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Route: POST /api/identify
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imagePath = req.file.path;
    const result = await analyzeImage(imagePath);

    // Serve uploaded image as static file
    const imageUrl = `/uploads/${path.basename(imagePath)}`;

    res.json({
      success: true,
      result,
      imageUrl,
    });
  } catch (err) {
    console.error("Error identifying image:", err.message);
    res.status(500).json({
      success: false,
      error: "Image analysis failed",
      details: err.message,
    });
  }
});

export default router;