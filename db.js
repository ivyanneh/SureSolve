import pg from 'pg'; 
import dotenv from 'dotenv';
dotenv.config();
const {Pool} = pg;

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect((err, client, release) => {
  if (err) {
    console.error("❌ Database connection error:", err)
  } else {
      console.log("✅ Database connected successfully!");
    //  release(); // Release the client back to the db
  }
});
export default db;
