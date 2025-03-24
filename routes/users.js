import express from "express";
import pool from "../db.js";

const users = express.Router();

// Get all users
users.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new user
users.post("/", async (req, res) => {
  const { username, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *",
      [username, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default users;
