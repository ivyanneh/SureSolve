import express from "express";
import bodyParser from 'body-parser';

import questionsRoutes from "./routes/questions.js";
console.log("✅ Questions routes imported!");

import usersRoutes from "./routes/users.js";
import answersRoutes from "./routes/answers.js";


const app = express();
const port = 5000;

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.get("/api/questions", questionsRoutes.getQuestions);
app.post("/api/questions", questionsRoutes.createQuestion);
app.get("/api/questions/:question_id", questionsRoutes.getQuestionById); 
app.put("/api/questions/:question_id", questionsRoutes.updateQuestion);
app.put("/api/questions/delete/:question_id",questionsRoutes.deleteQuestion);


app.get("/api", (req, res) => {
  res.send("Root is working!");
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});

app.use((req, res) => {
  res.status(404).send(`Cannot ${req.method} ${req.originalUrl}`);
});

