import express from "express";
import pool from "../db.js";

const app = express();
app.use(express.json());

const createBookmark = async (req, res) => {
  const { user_id, question_id, answer_id, created_at, updated_at, voided, voided_by, voided_reason, voided_date } = req.body;
  try {
    const newBookmark = await pool.query(
      `INSERT INTO bookmarks (user_id, question_id, answer_id, created_at, updated_at, voided, voided_by, voided_reason, voided_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [user_id, question_id, answer_id, created_at, updated_at, voided, voided_by, voided_reason, voided_date]
    );
    res.status(201).json(newBookmark.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get All Bookmarks
const getAllBookmarks = async (req, res) => {
  try {
    const bookmarks = await pool.query("SELECT * FROM bookmarks");
    res.json(bookmarks.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a Single Bookmark by ID
const getBookmarkById = async (req, res) => {
  const { bookmark_id } = req.params;
  try {
    const bookmark = await pool.query("SELECT * FROM bookmarks WHERE bookmark_id = $1", [bookmark_id]);
    if (bookmark.rows.length === 0) return res.status(404).json({ error: "Bookmark not found" });
    res.json(bookmark.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Bookmark
const updateBookmark = async (req, res) => {
  const { bookmark_id } = req.params;
  const { updated_at, voided, voided_by, voided_reason } = req.body;
  try {
    const updatedBookmark = await pool.query(
      `UPDATE bookmarks 
       SET updated_at = $1, voided = $2, voided_by = $3, voided_reason = $4 
       WHERE bookmark_id = $5 RETURNING *`,
      [updated_at, voided, voided_by, voided_reason, bookmark_id]
    );
    if (updatedBookmark.rows.length === 0) return res.status(404).json({ error: "Bookmark not found" });
    res.json(updatedBookmark.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Bookmark
const deleteBookmark = async (req, res) => {
  const { bookmark_id } = req.params;
  try {
    const deletedBookmark = await pool.query("DELETE FROM bookmarks WHERE bookmark_id = $1 RETURNING *", [bookmark_id]);
    if (deletedBookmark.rows.length === 0) return res.status(404).json({ error: "Bookmark not found" });
    res.json({ message: "Bookmark deleted successfully", deletedBookmark: deletedBookmark.rows[0] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { createBookmark, getAllBookmarks, getBookmarkById, updateBookmark, deleteBookmark };
