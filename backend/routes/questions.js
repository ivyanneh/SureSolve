import express from "express";
import pool from "../db.js";

//const questions = express.Router();

// Create a Question
const createQuestion = async (req, res) => {
  const { unique_id, title, description, category_id, asker_id, has_media, created_at, updated_at, created_by, updated_by, voided, voided_by, voided_reason, voided_date } = req.body;

  try {
    const newQuestion = await pool.query(
      `INSERT INTO questions (unique_id, title, description, category_id, asker_id, has_media, created_at, updated_at, created_by, updated_by, voided, voided_by, voided_reason, voided_date) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
       RETURNING *`,
      [unique_id, title, description, category_id, asker_id, has_media, created_at, updated_at, created_by, updated_by, voided, voided_by, voided_reason, voided_date]
    );
    res.status(201).json(newQuestion.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get All Questions
const getQuestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const questions = await pool.query("SELECT * FROM questions LIMIT $1 OFFSET $2");
    res.json({
      page,
      limit,
      total: questions.rowCount,   
      questions: questions.rows
  });
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
  const { title, description, category_id, updated_at, updated_by } = req.body;

  try {
    const updatedQuestion = await pool.query(
      `UPDATE questions 
       SET title = $1, description = $2, category_id = $3, updated_at = $4, updated_by = $5
       WHERE question_id = $6 
       RETURNING *`,
      [title, description, category_id, updated_at, updated_by, question_id]
    );

    if (updatedQuestion.rows.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(updatedQuestion.rows[0]);
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
