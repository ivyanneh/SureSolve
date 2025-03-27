import express from "express";
import pool from "../db.js";

// Middleware to parse JSON
const app = express();
app.use(express.json());

// Create a User
const createUser = async (req, res) => {
  const { name, email, password, phone_number, profile_picture, address, status, created_at, updated_at, created_by, updated_by, voided, voided_by, voided_reason, voided_date } = req.body;

  try {
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password, phone_number, profile_picture, address, status, created_at, updated_at, created_by, updated_by, voided, voided_by, voided_reason, voided_date) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
      RETURNING *`,
      [name, email, password, phone_number, profile_picture, address, status, created_at, updated_at, created_by, updated_by, voided, voided_by, voided_reason, voided_date]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    if (users.rows.length === 0)
      return res.status(404).json({ error: "No users found" });
    res.json(users.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a Single User by ID
const getUserById = async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
    if (user.rows.length === 0)
      return res.status(404).json({ error: "User not found" });
    res.json(user.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a User
const updateUser = async (req, res) => {
  const { user_id } = req.params;  // Get user_id from the URL
  const { name, email, phone_number, profile_picture, address, status, updated_by } = req.body;

  try {
    const updatedUser = await pool.query(
      `UPDATE users 
       SET name = $1, email = $2, phone_number = $3, profile_picture = $4, address = $5, status = $6, updated_at = now(), updated_by = $7
       WHERE user_id = $8
       RETURNING *`,
      [name, email, phone_number, profile_picture, address, status, updated_by, user_id]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Delete a User (Soft Delete)
const deleteUser = async (req, res) => {
  const user_id  = parseInt(req.params.user_id);
  const { voided, voided_by, voided_reason } = req.body;

  try {
    const deletedUser = await pool.query(
     "UPDATE users SET voided = $1, voided_by = $2, voided_reason =$3, voided_date = now() WHERE user_id = $4",
      [voided, voided_by, voided_reason, user_id]
    );

    res.json(deletedUser.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { createUser, getUsers, getUserById, updateUser, deleteUser };
