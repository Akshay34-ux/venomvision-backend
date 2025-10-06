// backend/src/index.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";

import uploadRoute from "./routes/identify.js";
import reportBiteRoute from "./routes/reportBite.js";
import adminRoute from "./routes/admin.js";
import handlerRoute from "./routes/handlers.js";
import adminHandlersRoute from "./routes/adminHandlers.js";
import reportsRoute from "./routes/reports.js";
import handlerAuthRoute from "./routes/handlerAuth.js";
import testMailRoute from "./routes/testMail.js";

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load ENV
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("Loaded ENV:", {
  EXOTEL_API_KEY: !!process.env.EXOTEL_API_KEY,
  EXOTEL_API_TOKEN: !!process.env.EXOTEL_API_TOKEN,
  EXOTEL_SID: process.env.EXOTEL_SID,
  EXOTEL_NUMBER: process.env.EXOTEL_NUMBER,
});

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ CORS setup — allow specific domains (Vercel + local)
app.use(
  cors({
    origin: [
      "https://venomvision-admin-panel-git-main-akshays-projects-538eede4.vercel.app", // your Vercel admin panel
      "https://venomvision-admin-panel.vercel.app", // optional, if you later rename it
      "https://venomvision-frontend.vercel.app", // if frontend might hit backend too
      "http://localhost:5173", // local dev frontend
      "http://localhost:3000", // local react alternative
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ✅ Routes
app.use("/api/identify", uploadRoute);
app.use("/api/report-bite", reportBiteRoute);
app.use("/api/handlers", handlerRoute);
app.use("/api/admin", adminRoute);
app.use("/api/admin/handlers", adminHandlersRoute);
app.use("/api/reports", reportsRoute);
app.use("/api/handlers/auth", handlerAuthRoute);
app.use("/api/test-mail", testMailRoute);

// ✅ Root test
app.get("/", (req, res) => {
  res.send("🚀 VenomVision Backend is running...");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});