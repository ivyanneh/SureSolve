import pool from "./db.js";

async function testConnection() {
  try {
    //const res = await pool.query("SELECT 1");
    const res = await pool.query("SELECT * FROM questions")
    console.log("Database connected:", res.rows);
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

testConnection();
