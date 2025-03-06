const express = require("express");
const router = express.Router();
const db = require("./db").default;

// Get all questions
router.get("/", async (req, res) => {
  try {
    const questions = await db.any("SELECT * FROM questions ORDER BY id DESC");
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new question
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newQuestion = await db.one(
      "INSERT INTO questions (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
