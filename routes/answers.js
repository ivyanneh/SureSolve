import express from "express";
import pool from "../db.js";


const answers = express.Router();

// Add an Answer
answers.post("/", async (req, res) => {
  const { question_id, answer_text, user_id } = req.body;
  try {
    const newAnswer = await pool.query(
      "INSERT INTO answers (question_id, answer_text, user_id) VALUES ($1, $2, $3) RETURNING *",
      [question_id, answer_text, user_id]
    );
    res.status(201).json(newAnswer.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Answers for a Question
answers.get("/:question_id", async (req, res) => {
  const { question_id } = req.params;
  try {
    const answers = await pool.query("SELECT * FROM answers WHERE question_id = $1", [question_id]);
    res.json(answers.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default answers;
