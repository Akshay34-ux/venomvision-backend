// backend/src/index.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import cors from "cors";

import uploadRoute from "./routes/identify.js";
import reportBiteRoute from "./routes/reportBite.js";
import adminRoute from "./routes/admin.js"; // ✅ Admin route
import handlerRoute from "./routes/handlers.js"; // ✅ Handlers route
import adminHandlersRoute from "./routes/adminHandlers.js";

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force dotenv to load from backend/.env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Debug log to confirm ENV is loaded
console.log("Loaded ENV:", {
  EXOTEL_API_KEY: !!process.env.EXOTEL_API_KEY,
  EXOTEL_API_TOKEN: !!process.env.EXOTEL_API_TOKEN,
  EXOTEL_SID: process.env.EXOTEL_SID,
  EXOTEL_NUMBER: process.env.EXOTEL_NUMBER,
});

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/identify", uploadRoute);
app.use("/api/report-bite", reportBiteRoute);
app.use("/api/admin", adminRoute); // ✅ Admin login route
app.use("/api/handlers", handlerRoute);  // ✅ Handlers management routes
app.use("/api/admin", adminHandlersRoute);
// Default route
app.get("/", (req, res) => {
  res.send("🚀 VenomVision Backend is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});