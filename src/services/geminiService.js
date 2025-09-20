// backend/src/services/geminiService.js
import dotenv from "dotenv";
dotenv.config(); // ✅ load environment variables
console.log("🔑 GEMINI KEY in service:", process.env.GEMINI_API_KEY?.slice(0, 15));
import fs from "fs";
import mime from "mime-types";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Debug log to confirm key is loaded
console.log("🔑 GEMINI KEY in service:", process.env.GEMINI_API_KEY?.slice(0, 15));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function analyzeImage(imagePath) {
  try {
    const buffer = fs.readFileSync(imagePath);

    const mimeType = mime.lookup(imagePath) || "image/jpeg";
    console.log("📂 Uploading:", imagePath, "MIME:", mimeType);

    const image = {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType,
      },
    };

    const prompt = `
You are a snake identification expert. Analyze the uploaded snake image and return ONLY valid JSON.

JSON format:
{
  "name": "Common name of the snake",
  "scientificName": "Scientific name",
  "dangerLevel": "low | medium | high | extreme",
  "venomType": "Type of venom (Neurotoxic/Hemotoxic/Mixed/None)",
  "traits": ["Key trait 1", "Key trait 2", "Key trait 3"],
  "habitat": "Typical habitats",
  "firstAid": [
    "Step 1",
    "Step 2",
    "Step 3"
  ]
}
`;

    const result = await model.generateContent([prompt, image]);
    let text = result.response.text().trim();
    console.log("📩 Gemini raw response:", text);

    // clean markdown if present
    let cleanText = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanText);
    } catch (e) {
      console.error("❌ JSON parse failed. Raw response:", cleanText);
      parsed = {
        name: "Unknown Snake",
        scientificName: "Unknown",
        dangerLevel: "unknown",
        venomType: "Unknown",
        traits: [],
        habitat: "Unknown",
        firstAid: ["Seek immediate medical help"],
      };
    }

    return parsed;
  } catch (err) {
    console.error("❌ Gemini API Error:", err.message || err);
    return {
      name: "Unknown Snake",
      scientificName: "Unknown",
      dangerLevel: "unknown",
      venomType: "Unknown",
      traits: [],
      habitat: "Unknown",
      firstAid: ["Seek immediate medical help"],
      error: err.message,
    };
  }
}