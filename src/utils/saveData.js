import fs from "fs";
import path from "path";

const biteReportFile = path.join(process.cwd(), "data/bite_reports.csv");

// Save bite report to CSV
export const saveBiteReport = async (report) => {
  const headers = [
    "VictimName",
    "Age",
    "Symptoms",
    "TimeOfBite",
    "Location",
    "GPS",
    "Timestamp"
  ];

  const row = [
    report.victimName,
    report.age,
    report.symptoms,
    report.timeOfBite,
    report.location,
    report.gps,
    report.timestamp
  ].join(",");

  try {
    if (!fs.existsSync(biteReportFile)) {
      fs.writeFileSync(biteReportFile, headers.join(",") + "\n");
    }
    fs.appendFileSync(biteReportFile, row + "\n");
    console.log("✅ Bite report saved:", row);
  } catch (err) {
    console.error("❌ Failed to save bite report:", err.message);
    throw err;
  }
};