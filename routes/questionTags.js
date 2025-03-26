import express from "express";
import pool from "../db.js";

const router = express.Router();
router.use(express.json());

// Create a Question Tag
const createQuestionTag = async (req, res) => {
  const { question_id, tag_id, created_by } = req.body;
  try {
    const newQuestionTag = await pool.query(
      `INSERT INTO question_tags (question_id, tag_id, created_at, created_by) 
       VALUES ($1, $2, NOW(), $3) RETURNING *`,
      [question_id, tag_id, created_by]
    );
    res.status(201).json(newQuestionTag.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Question Tags
const getQuestionTags = async (req, res) => {
  try {
    const allTags = await pool.query("SELECT * FROM question_tags");
    res.json(allTags.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Question Tags by Question ID
const getQuestionTagById = async (req, res) => {
  const { question_id } = req.params;
  try {
    const tags = await pool.query(
      "SELECT * FROM question_tags WHERE question_id = $1",
      [question_id]
    );
    if (tags.rows.length === 0) {
      return res.status(404).json({ error: "No tags found for this question" });
    }
    res.json(tags.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Question Tag
const updateQuestionTag = async (req, res) => {
  const { question_id, tag_id } = req.params;
  const { updated_by } = req.body;
  
  try {
    const updatedTag = await pool.query(
      `UPDATE question_tags 
       SET updated_by = $1, updated_at = NOW() 
       WHERE question_id = $2 AND tag_id = $3 
       RETURNING *`,
      [updated_by, question_id, tag_id]
    );

    if (updatedTag.rows.length === 0) {
      return res.status(404).json({ error: "Question Tag not found" });
    }

    res.json(updatedTag.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Delete a Question Tag
const deleteQuestionTag = async (req, res) => {
  const { question_id, tag_id } = req.params;
  try {
    const deletedTag = await pool.query(
      `DELETE FROM question_tags 
       WHERE question_id = $1 AND tag_id = $2 RETURNING *`,
      [question_id, tag_id]
    );
    if (deletedTag.rows.length === 0) {
      return res.status(404).json({ error: "Question tag not found" });
    }
    res.json({ message: "Question tag deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export {createQuestionTag, getQuestionTags, getQuestionTagById, updateQuestionTag, deleteQuestionTag };
