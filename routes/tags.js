import express from "express";
import pool from "../db.js";

const router = express.Router();
router.use(express.json());

// Create a Tag
const createTag = async (req, res) => {
  const { name, created_by } = req.body;
  try {
    const newTag = await pool.query(
      `INSERT INTO tags (name, created_at, updated_at, created_by) 
       VALUES ($1, now(), now(), $2) RETURNING *`,
      [name, created_by]  // 🚀 No need to pass tag_id anymore
    );
    res.status(201).json(newTag.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


//  Get All Tags
const getTags = async (req, res) => {
  try {
    const tags = await pool.query("SELECT * FROM tags WHERE voided = false OR voided IS NULL");
    res.json(tags.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get a Single Tag by ID
const getTagById = async (req, res) => {
  const { tag_id } = req.params;
  try {
    const tag = await pool.query("SELECT * FROM tags WHERE tag_id = $1", [tag_id]);
    if (tag.rows.length === 0) return res.status(404).json({ error: "Tag not found" });
    res.json(tag.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Update a Tag
const updateTag = async (req, res) => {
  const { tag_id } = req.params;
  const { name, updated_by } = req.body;
  try {
    const updatedTag = await pool.query(
      `UPDATE tags 
       SET name = $1, updated_at = now(), updated_by = $2
       WHERE tag_id = $3 
       RETURNING *`,
      [name, updated_by, tag_id]
    );
    if (updatedTag.rows.length === 0) return res.status(404).json({ error: "Tag not found" });
    res.json(updatedTag.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//  Delete (Void) a Tag
const deleteTag = async (req, res) => {
  const { tag_id } = req.params;
  const { voided_by, voided_reason } = req.body;
  try {
    const deletedTag = await pool.query(
      `UPDATE tags 
       SET voided = true, voided_by = $1, voided_reason = $2, voided_date = now()
       WHERE tag_id = $3 
       RETURNING *`,
      [voided_by, voided_reason, tag_id]
    );
    if (deletedTag.rows.length === 0) return res.status(404).json({ error: "Tag not found" });
    res.json(deletedTag.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { createTag, getTags, getTagById, updateTag, deleteTag };
