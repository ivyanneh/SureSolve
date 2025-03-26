import express from "express";
import pool from "../db.js";

//const answers = express.Router();
const app = express();
app.use(express.json());

// Create an Answer
const createAnswer = async (req, res) => {
  const { answer_id, question_id, user_id, answer_text, has_media, is_accepted, created_at, updated_at, created_by, updated_by, voided, voided_by, voided_reason, voided_date } = req.body;
  try {
    const newAnswer = await pool.query(
      "INSERT INTO answers (answer_id, question_id, user_id, answer_text, has_media, is_accepted, created_at, updated_at, created_by, updated_by, voided, voided_by, voided_reason, voided_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *",
      [answer_id, question_id, user_id, answer_text, has_media, is_accepted, created_at, updated_at, created_by, updated_by, voided, voided_by, voided_reason, voided_date]
    );
    res.status(201).json(newAnswer.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get All Answers for a Question
const getAnswers = async (req, res) => {
  const { question_id } = req.params;
  try {
    const answers = await pool.query(
      "SELECT * FROM answers WHERE question_id = $1",
      [question_id]
    );
    if (answers.rows.length === 0)
      return res.status(404).json({ error: "No answers found for this question" });
    res.json(answers.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get a Single Answer
const getAnswerById = async (req, res) => {
  const { answer_id } = req.params;
  try {
    const answer = await pool.query("SELECT * FROM answers WHERE answer_id = $1", [answer_id]);
    if (answer.rows.length === 0)
      return res.status(404).json({ error: "Answer not found" });
    res.json(answer.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an Answer
const updateAnswer = async (req, res) => {
  const { answer_id } = req.params;
  const { answer_text, updated_at, updated_by } = req.body;
  try {
    const updatedAnswer = await pool.query(
      "UPDATE answers SET answer_text = $1, updated_at = $2, updated_by = $3 WHERE answer_id = $4 RETURNING *",
      [answer_text, updated_at, updated_by, answer_id]
    );
    if (updatedAnswer.rows.length === 0)
      return res.status(404).json({ error: "Answer not found" });
    res.json(updatedAnswer.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Delete an Answer
const deleteAnswer = async (req, res) => {
  const { answer_id } = req.params;
  const { voided, voided_by, voided_reason } = req.body;
  try {
    const deletedAnswer = await pool.query(
      "UPDATE answers SET voided = $1, voided_by = $2, voided_reason = $3, voided_date = now() WHERE answer_id = $4 RETURNING *",
      [voided, voided_by, voided_reason, answer_id]
    );
    if (deletedAnswer.rows.length === 0)
      return res.status(404).json({ error: "Answer not found" });
    res.json(deletedAnswer.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { createAnswer,  getAnswers, getAnswerById, updateAnswer, deleteAnswer };
