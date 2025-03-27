import express from "express";
import pool from "../db.js";

const router = express.Router();
router.use(express.json());

//  Create a Star
const createStar = async (req, res) => {
  const { star_id, user_id, question_id, answer_id, created_by } = req.body;
  try {
    const newStar = await pool.query(
      "INSERT INTO starred (user_id, question_id) VALUES ($1, $2) RETURNING *",
      [user_id, question_id]
  );
  
      
    res.status(201).json(newStar.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//  Get All Stars
const getAllStars = async (req, res) => {
  try {
    const stars = await pool.query("SELECT * FROM starred");
    res.json(stars.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get Star by ID
const getStarById = async (req, res) => {
  const { star_id } = req.params;
  try {
    const star = await pool.query("SELECT * FROM starred WHERE star_id = $1", [star_id]);
    if (star.rows.length === 0) {
      return res.status(404).json({ error: "Star not found" });
    }
    res.json(star.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Update a Star
const updateStar = async (req, res) => {
  const { star_id } = req.params;
  const { updated_by } = req.body;
  try {
    const updatedStar = await pool.query(
      `UPDATE starred SET updated_by = $1, updated_at = now() WHERE star_id = $2 RETURNING *`,
      [updated_by, star_id]
    );
    if (updatedStar.rows.length === 0) {
      return res.status(404).json({ error: "Star not found" });
    }
    res.json(updatedStar.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//  Delete a Star
const deleteStar = async (req, res) => {
  const { star_id } = req.params;
  const { voided_by, voided_reason } = req.body;
  try {
    const deletedStar = await pool.query(
      `UPDATE starred 
       SET voided = true, voided_by = $1, voided_reason = $2, voided_date = now() 
       WHERE star_id = $3 RETURNING *`,
      [voided_by, voided_reason, star_id]
    );
    if (deletedStar.rows.length === 0) {
      return res.status(404).json({ error: "Star not found" });
    }
    res.json(deletedStar.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//  Export Routes
export { createStar, getAllStars, getStarById, updateStar, deleteStar };
