// backend/src/services/exotelService.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

// Ensure .env is loaded (same as in index.js)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const API_KEY = process.env.EXOTEL_API_KEY;
const API_TOKEN = process.env.EXOTEL_API_TOKEN;
const SID = process.env.EXOTEL_SID;
const SUBDOMAIN = process.env.EXOTEL_SUBDOMAIN || "api.exotel.com";
const EXOPHONE = process.env.EXOTEL_NUMBER;

// Debug log
console.log("🔑 Exotel Config:", {
  API_KEY: !!API_KEY,
  API_TOKEN: !!API_TOKEN,
  SID,
  EXOPHONE,
});

if (!API_KEY || !API_TOKEN || !SID || !EXOPHONE) {
  console.warn("⚠️ Exotel env missing: make sure EXOTEL_API_KEY, EXOTEL_API_TOKEN, EXOTEL_SID, and EXOTEL_NUMBER are set");
}

const baseUrl = `https://${SUBDOMAIN}/v1/Accounts/${SID}`;

export async function sendSMS(to, body) {
  try {
    const url = `${baseUrl}/Sms/send.json`;
    console.log("📩 Sending SMS via:", url);

    const res = await axios.post(
      url,
      new URLSearchParams({
        From: EXOPHONE,
        To: to,
        Body: body,
      }),
      {
        auth: { username: API_KEY, password: API_TOKEN },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 15000,
      }
    );

    console.log("✅ Exotel SMS response:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ SMS error:", err.response?.data ?? err.message);
    throw err;
  }
}

export async function makeCall(to, exomlUrl = "http://my.exotel.com/exoml/start/12345") {
  try {
    const url = `${baseUrl}/Calls/connect.json`;
    console.log("📞 Making call via:", url);

    const res = await axios.post(
      url,
      new URLSearchParams({
        From: EXOPHONE,
        To: to,
        CallerId: EXOPHONE,
        Url: exomlUrl,
      }),
      {
        auth: { username: API_KEY, password: API_TOKEN },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 15000,
      }
    );

    console.log("✅ Exotel Call response:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Call error:", err.response?.data ?? err.message);
    throw err;
  }
}