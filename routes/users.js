import express from 'express';
const router = express.Router();
import db from '../db.js'; 
// Mock database
const users = [
 db.query(`SELECT * FROM users;`)
];

// Getting the list of users from the mock database
router.get('/', (req, res) => {
    res.send(users);
})

router.post('/', (req, res) => {
  const user = req.body;

  users.push({ ...user, id: uuidv4() });

  res.send(`${user.first_name} has been added to the Database`);
})

export default router