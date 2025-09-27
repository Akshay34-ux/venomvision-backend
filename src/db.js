// backend/src/db.js
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  host: "db.qjmshsilfvnjfoggcvca.supabase.co", // ✅ force IPv4 host
  port: 5432,
  user: "postgres",
  password: "a+qVRmAztj6&V69", // ✅ your actual password
  database: "postgres"
});

pool.connect()
  .then(() => console.log("✅ Connected to Supabase DB"))
  .catch(err => console.error("❌ DB Connection Failed:", err.message));

export default pool;