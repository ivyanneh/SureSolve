import express from "express";
import pool from "../db.js";

const app = express();
app.use(express.json());

const createCategory = async (req, res) => {
  const { name, description, created_at, updated_at } = req.body;
  try {
    const newCategory = await pool.query(
      `INSERT INTO categories (name, description, created_at, updated_at)
      VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description, created_at, updated_at]
    );
    res.status(201).json(newCategory.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get All Categories
const getCategories = async (req, res) => {
  try {
    const categories = await pool.query("SELECT * FROM categories");
    if (categories.rows.length === 0)
      return res.status(404).json({ error: "No categories found" });
    res.json(categories.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a Single Category
const getCategoryById = async (req, res) => {
  const { category_id } = req.params;
  try {
    const category = await pool.query("SELECT * FROM categories WHERE category_id = $1", [category_id]);
    if (category.rows.length === 0)
      return res.status(404).json({ error: "Category not found" });
    res.json(category.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Category
const updateCategory = async (req, res) => {
  const { category_id } = req.params;
  const { name, description, updated_at } = req.body;
  try {
    const updatedCategory = await pool.query(
      `UPDATE categories 
      SET name = $1, description = $2, updated_at = $3 
      WHERE category_id = $4 
      RETURNING *`,
      [name, description, updated_at, category_id]
    );
    if (updatedCategory.rows.length === 0)
      return res.status(404).json({ error: "Category not found" });
    res.json(updatedCategory.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Category
const deleteCategory = async (req, res) => {
  const { category_id } = req.params;
  try {
    const deletedCategory = await pool.query(
      `DELETE FROM categories WHERE category_id = $1 RETURNING *`,
      [category_id]
    );
    if (deletedCategory.rows.length === 0)
      return res.status(404).json({ error: "Category not found" });
    res.json(deletedCategory.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Export all functions
export { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory };
