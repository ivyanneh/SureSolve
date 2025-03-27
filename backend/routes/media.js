import express from "express";
import pool from "../db.js";

// Create Media
const createMedia = async (req, res) => {
  const { media_id, related_id, media_type, media_url, created_at, updated_at, created_by, updated_by, voided, voided_by, voided_reason, voided_date } = req.body;
  
  try {
    // Check if related_id exists in questions, answers, or users
    const relatedExists = await pool.query(
      `
      SELECT 1 
      FROM questions 
      WHERE question_id = $1
      UNION 
      SELECT 1 
      FROM answers 
      WHERE answer_id = $1
      UNION
      SELECT 1 
      FROM users 
      WHERE user_id = $1
      `,
      [related_id]
    );

    if (relatedExists.rows.length === 0) {
      return res.status(400).json({
        error: "Invalid related_id: No matching question, answer, or user found.",
      });
    }



    const newMedia = await pool.query(
      `INSERT INTO media (
        related_id, media_type, media_url, created_at, updated_at, 
        created_by, updated_by, voided, voided_by, voided_reason, voided_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        related_id, media_type, media_url, created_at, updated_at,
        created_by, updated_by, voided, voided_by, voided_reason, voided_date
      ]
    );
    
    res.status(201).json(newMedia.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Media
const getAllMedia = async (req, res) => {
  try {
    const media = await pool.query("SELECT * FROM media");
    res.json(media.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Media by ID
const getMediaById = async (req, res) => {
  const { media_id } = req.params;
  try {
    const media = await pool.query("SELECT * FROM media WHERE media_id = $1", [media_id]);
    if (media.rows.length === 0)
      return res.status(404).json({ error: "Media not found" });
    res.json(media.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Media
const updateMedia = async (req, res) => {
  const { media_id } = req.params;
  const { media_type, media_url, updated_at, updated_by } = req.body;
  try {
    const updatedMedia = await pool.query(
      `UPDATE media 
       SET media_type = $1, media_url = $2, updated_at = $3, updated_by = $4
       WHERE media_id = $5 
       RETURNING *`,
      [media_type, media_url, updated_at, updated_by, media_id]
    );
    if (updatedMedia.rows.length === 0)
      return res.status(404).json({ error: "Media not found" });
    res.json(updatedMedia.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Media
const deleteMedia = async (req, res) => {
  const { media_id } = req.params;
  const { voided, voided_by, voided_reason } = req.body;
  try {
    const deletedMedia = await pool.query(
      `UPDATE media 
       SET voided = $1, voided_by = $2, voided_reason = $3, voided_date = now() 
       WHERE media_id = $4 
       RETURNING *`,
      [voided, voided_by, voided_reason, media_id]
    );
    if (deletedMedia.rows.length === 0)
      return res.status(404).json({ error: "Media not found" });
    res.json(deletedMedia.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {createMedia, getAllMedia, getMediaById, updateMedia, deleteMedia };
