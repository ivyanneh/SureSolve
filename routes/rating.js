import express from "express";
import pool from "../db.js";

const router = express.Router();
router.use(express.json());

// Create a Rating
const createRating = async (req, res) => {
    const { user_id, question_id, rating_value } = req.body;
  
    try {
        const { rating_id, user_id, question_id, rating_value } = req.body;
        const newRating = await pool.query(
          "INSERT INTO rating (rating_id, user_id, question_id, rating_value) VALUES ($1, $2, $3, $4) RETURNING *",
          [rating_id, user_id, question_id, rating_value]
        );
        res.status(201).json(newRating.rows[0]);
        

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Get All Ratings
const getAllRatings = async (req, res) => {
  try {
    const ratings = await pool.query("SELECT * FROM rating");
    res.json(ratings.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Ratings by ID
const getRatingById = async (req, res) => {
  const { rating_id } = req.params;
  try {
    const rating = await pool.query("SELECT * FROM rating WHERE rating_id = $1", [rating_id]);

    if (rating.rows.length === 0)
      return res.status(404).json({ error: "Rating not found" });

    res.json(rating.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Rating
const updateRating = async (req, res) => {
  const { rating_id } = req.params;
  const { rating_value, updated_by } = req.body;

  try {
    const updatedRating = await pool.query(
      `UPDATE rating
      SET rating_value = $1, updated_at = NOW(), updated_by = $2 
      WHERE rating_id = $3 
      RETURNING *`,
      [rating_value, updated_by, rating_id]
    );

    if (updatedRating.rows.length === 0)
      return res.status(404).json({ error: "Rating not found" });

    res.json(updatedRating.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Rating (Soft Delete)
const deleteRating = async (req, res) => {
  const { rating_id } = req.params;
  const { voided_by, voided_reason } = req.body;

  try {
    const deletedRating = await pool.query(
      `UPDATE ratings 
      SET voided = TRUE, voided_by = $1, voided_reason = $2, voided_date = NOW() 
      WHERE rating_id = $3 
      RETURNING *`,
      [voided_by, voided_reason, rating_id]
    );

    if (deletedRating.rows.length === 0)
      return res.status(404).json({ error: "Rating not found" });

    res.json(deletedRating.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {createRating, getAllRatings, getRatingById, updateRating, deleteRating };
