import pool from "../db.js";

// Create a Vote
const createVote = async (req, res) => {
    const { answer_id, voter_id, vote_value, created_at, updated_at, created_by, updated_by, voided, voided_by, voided_reason, voided_date } = req.body;
    try {
      const newVote = await pool.query(
        "INSERT INTO votes (answer_id, voter_id, vote_value, created_at, updated_at, created_by, updated_by, voided, voided_by, voided_reason, voided_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
        [answer_id, voter_id, vote_value, created_at, updated_at, created_by, updated_by, voided, voided_by, voided_reason, voided_date]
      );
      res.status(201).json(newVote.rows[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

// Get All Votes for a Specific Answer
const getAllVotesForAnswer = async (req, res) => {
  const { answer_id } = req.params;
  try {
    const votes = await pool.query("SELECT * FROM votes WHERE answer_id = $1", [answer_id]);
    if (votes.rows.length === 0) {
      return res.status(404).json({ error: "No votes found for this answer" });
    }
    res.json(votes.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a Single Vote by ID
const getVoteById = async (req, res) => {
  const { vote_id } = req.params;
  try {
    const vote = await pool.query("SELECT * FROM votes WHERE vote_id = $1", [vote_id]);
    if (vote.rows.length === 0) {
      return res.status(404).json({ error: "Vote not found" });
    }
    res.json(vote.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Vote
const updateVote = async (req, res) => {
  const { vote_id } = req.params;
  const { vote_value, updated_at, updated_by } = req.body;
  try {
    const updatedVote = await pool.query(
      "UPDATE votes SET vote_value = $1, updated_at = $2, updated_by = $3 WHERE vote_id = $4 RETURNING *",
      [vote_value, updated_at, updated_by, vote_id]
    );
    if (updatedVote.rows.length === 0) {
      return res.status(404).json({ error: "Vote not found" });
    }
    res.json(updatedVote.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete (Voiding) a Vote
const deleteVote = async (req, res) => {
  const { vote_id } = req.params;
  const { voided, voided_by, voided_reason } = req.body;
  try {
    const deletedVote = await pool.query(
      "UPDATE votes SET voided = $1, voided_by = $2, voided_reason = $3, voided_date = now() WHERE vote_id = $4 RETURNING *",
      [voided, voided_by, voided_reason, vote_id]
    );
    if (deletedVote.rows.length === 0) {
      return res.status(404).json({ error: "Vote not found" });
    }
    res.json(deletedVote.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { createVote, getAllVotesForAnswer, getVoteById, updateVote, deleteVote };
