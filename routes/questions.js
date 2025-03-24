import express from "express";
import pool from "../db.js";


const router = express.Router();

// Create a Question
router.post("/", async (req, res) => {
  const { title, description, user_id } = req.body;
  try {
    const newQuestion = await pool.query(
      "INSERT INTO questions (title, description, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, description, user_id]
    );
    res.status(201).json(newQuestion.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Questions
router.get("/", async (req, res) => {
  try {
    const questions = await pool.query("SELECT * FROM questions");
    res.json(questions.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a Single Question
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const question = await pool.query("SELECT * FROM questions WHERE id = $1", [id]);
    if (question.rows.length === 0) return res.status(404).json({ error: "Question not found" });
    res.json(question.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


