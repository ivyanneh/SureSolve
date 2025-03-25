import express from "express";
import pool from "../db.js";

//const questions = express.Router();

// Create a Question
const createQuestion = async (req, res) => {
  const { question_id, unique_id, title, description, category_id,asker_id, has_media, created_at, updated_at, created_by, updated_by, voided, voided_by,voided_reason, voided_date } = req.body;
  try {
    const newQuestion = await pool.query(
      "INSERT INTO questions (question_id,title, description) VALUES ($1, $2, $3) RETURNING *",
      [question_id, unique_id, title, description, category_id,asker_id, has_media, created_at, updated_at, created_by, updated_by, voided, voided_by,voided_reason, voided_date]
    );
    res.status(201).json(newQuestion.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Questions
const getQuestions = async (req, res) => {
  try {
    const questions = await pool.query("SELECT * FROM questions LIMIT 10");//TO-DO:Add pagination
    res.json(questions.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a Single Question
const getQuestionById = async (req, res) => {
  const { question_id } = req.params;
  try {
    const question = await pool.query(
      "SELECT * FROM questions WHERE question_id = $1",
      [question_id]
    );
    if (question.rows.length === 0)
      return res.status(404).json({ error: "Question not found" });
    res.json(question.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateQuestion = async (req, res) => {
  const { question_id } = req.params;
  const { title, description, category_id } = req.body;
  try {
    const newQuestion = await pool.query(
      "UPDATE questions SET title = $1, description = $2, category_id = $3  WHERE question_id = $4 ",
      [question_id, unique_id, title, description, category_id,asker_id, has_media, created_at, updated_at, created_by, updated_by, voided, voided_by,voided_reason, voided_date]
    );
    res.status(201).json(newQuestion.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  const question_id = parseInt(req.params.question_id);
  const { voided, voided_by, voided_reason } = req.body;
  try {
    const newQuestion = await pool.query(
      "UPDATE questions SET voided = $1, voided_by = $2, voided_reason =$3, voided_date = now() WHERE question_id = $4 ",
      [voided, voided_by, voided_reason, question_id]
    );
    res.status(201).json(newQuestion.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
