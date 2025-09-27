// backend/src/db.js
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: "db.qjmshsilfvnjfoggcvca.supabase.co", // Supabase host
  port: 5432,
  user: "postgres", // default Supabase user
  password: "a+qVRmAztj6&V69", // ⚠️ your actual Supabase password
  database: "postgres",
  ssl: { rejectUnauthorized: false }
});

// Debug connection
pool.connect()
  .then(() => console.log("✅ Connected to Supabase DB"))
  .catch(err => console.error("❌ DB Connection Failed:", err.message));

export default pool;