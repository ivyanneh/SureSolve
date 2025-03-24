import express from "express";
import pool from "../db.js";

const router = express.Router();

// Get all answers for a specific question
router.get("/:question_id", async (req, res) => {
  const { question_id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM answers WHERE question_id = $1",
      [question_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Post an answer to a question
router.post("/", async (req, res) => {
  const { question_id, user_id, answer_text } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO answers (question_id, user_id, answer_text) VALUES ($1, $2, $3) RETURNING *",
      [question_id, user_id, answer_text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
