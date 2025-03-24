import express from "express";
import bodyParser from 'body-parser';

import questionsRoutes from "./routes/questions.js";
console.log("✅ Questions routes imported!");

import usersRoutes from "./users.js";
import answersRoutes from "./answers.js";


const app = express();
const port = 5000;

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.get("/api/questions", questionsRoutes);

app.get("/api", (req, res) => {
  res.send("Root is working!");
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});

app.use((req, res) => {
  res.status(404).send(`Cannot ${req.method} ${req.originalUrl}`);
});

