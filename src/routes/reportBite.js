// backend/src/routes/reportBite.js
import express from "express";
import { sendSMS, makeCall } from "../services/exotelService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { victimName, age, symptoms, timeOfBite, location, gps } = req.body || {};

    const report = {
      victimName, age, symptoms, timeOfBite, location, gps, timestamp: new Date().toISOString()
    };

    // Example recipients — **use numbers verified in Exotel address book on trial**
    const contacts = [
      { name: "Victoria Hospital", number: "+918970401681" },
      { name: "Rajesh (handler)", number: "+919353061896" },
    ];

    const message = `🚨 Snake bite emergency
Victim: ${victimName || "unknown"}
Age: ${age || "unknown"}
Location: ${location || gps || "unknown"}
Time: ${timeOfBite || "unknown"}
Symptoms: ${symptoms || "not provided"}`;

    const notifyResults = [];

    for (const c of contacts) {
      try {
        const smsRes = await sendSMS(c.number, message);
        let callRes = null;
        try {
          callRes = await makeCall(c.number); // optionally pass exoml URL as second arg
        } catch (callErr) {
          console.warn(`Call failed for ${c.name}:`, callErr?.response?.data ?? callErr.message);
        }
        notifyResults.push({ contact: c.name, sms: smsRes, call: callRes, status: "notified" });
      } catch (err) {
        console.error(`⚠️ Failed to notify ${c.name}:`, err?.response?.data ?? err.message);
        notifyResults.push({ contact: c.name, error: err?.response?.data ?? err.message, status: "failed" });
      }
    }

    // Optionally save `report` and `notifyResults` to a file or DB here.

    res.json({ success: true, message: "Report submitted", report, notifyResults });
  } catch (err) {
    console.error("Report endpoint error:", err);
    res.status(500).json({ error: "Failed to submit report" });
  }
});

export default router;