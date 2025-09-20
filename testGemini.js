import "dotenv/config";
import { analyzeImage } from "./src/services/geminiService.js";

(async () => {
  try {
    const result = await analyzeImage("./68fd3e1207db9b0874fd7fdfc4a0678f.jpg"); // put a sample snake image in backend/
    console.log("✅ Analysis Result:", result);
  } catch (err) {
    console.error("❌ Test failed:", err.message);
  }
})();