// backend/src/db.js
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // from .env
  ssl: {
    rejectUnauthorized: false, // Supabase requires this
  },
});

// quick connection test
pool.connect()
  .then(() => console.log("✅ Database connected successfully"))
  .catch(err => console.error("❌ DB Connection Error:", err.message));

export default pool;