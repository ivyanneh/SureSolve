import express from "express";
import bodyParser from 'body-parser';

import questionsRoutes from "./routes/questions.js";
console.log("✅ Questions routes imported!");

import { createAnswer, getAnswers, getAnswerById, updateAnswer, deleteAnswer } from "./routes/answers.js";

import { createUser, getUsers, getUserById, updateUser, deleteUser } from "./routes/users.js";

import { createBookmark, getAllBookmarks, getBookmarkById, updateBookmark, deleteBookmark } from "./routes/bookmarks.js";

import {createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from "./routes/categories.js";

import {createMedia, getAllMedia, getMediaById, updateMedia, deleteMedia } from "./routes/media.js";

import { createQuestionTag, getQuestionTags, getQuestionTagById, updateQuestionTag, deleteQuestionTag } from "./routes/questionTags.js";
console.log("✅ Question Tags routes imported!");

import { createTag, getTags, getTagById, updateTag, deleteTag } from "./routes/tags.js";

import {createRating, getAllRatings, getRatingById, updateRating, deleteRating} from "./routes/rating.js";

import { createStar, getAllStars, getStarById, updateStar, deleteStar } from "./routes/starred.js";

import { createVote, getAllVotesForAnswer, getVoteById, updateVote, deleteVote } from "./routes/votes.js";

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// Questions routes
app.get("/api/questions", questionsRoutes.getQuestions);
app.post("/api/questions", questionsRoutes.createQuestion);
app.get("/api/questions/:question_id", questionsRoutes.getQuestionById); 
app.put("/api/questions/:question_id", questionsRoutes.updateQuestion);
app.put("/api/questions/delete/:question_id", questionsRoutes.deleteQuestion);

// Answer Routes
app.post("/api/answers", createAnswer);
app.get("/api/answers/question/:question_id",getAnswers);
app.get("/api/answers/answer/:answer_id", getAnswerById);
app.put("/api/answers/:answer_id", updateAnswer);
app.put("/api/answers/delete/:answer_id", deleteAnswer);

//  User Routes
app.post("/api/users", createUser);
app.get("/api/users", getUsers);
app.get("/api/users/:user_id", getUserById);
app.put("/api/users/:user_id", updateUser);
app.put("/api/users/delete/:user_id", deleteUser);

// Bookmark Routes
app.post("/api/bookmarks", createBookmark);
app.get("/api/bookmarks", getAllBookmarks);
app.get("/api/bookmarks/:bookmark_id", getBookmarkById);
app.put("/api/bookmarks/:bookmark_id", updateBookmark);
app.put("/api/bookmarks/delete/:bookmark_id", deleteBookmark);

// Category Routes
app.post("/api/categories", createCategory);
app.get("/api/categories", getCategories);
app.get("/api/categories/:category_id", getCategoryById);
app.put("/api/categories/:category_id", updateCategory);
app.put("/api/categories/delete/:category_id", deleteCategory);

// Media Routes
app.post("/api/media", createMedia);
app.get("/api/media", getAllMedia);
app.get("/api/media/:media_id", getMediaById);
app.put("/api/media/:media_id", updateMedia);
app.put("/api/media/delete:media_id", deleteMedia);

// QuestionTags Routes
app.post("/api/questionTags", createQuestionTag);
app.get("/api/questionTags", getQuestionTags);
app.get("/api/questionTags/:question_id/:tag_id", getQuestionTagById);
app.put("/api/questionTags/:question_id/:tag_id", updateQuestionTag);
app.put("/api/questionTags/delete/:question_id/:tag_id", deleteQuestionTag);

// Tag Routes
app.post("/api/tags", createTag);
app.get("/api/tags", getTags);
app.get("/api/tags/:tag_id", getTagById);
app.put("/api/tags/:tag_id", updateTag);
app.put("/api/tags/delete/:tag_id", deleteTag);

// Rating Routes
app.post("/api/rating", createRating);
app.get("/api/rating", getAllRatings);
app.get("/api/rating/:rating_id", getRatingById);
app.put("/api/rating/:rating_id", updateRating);
app.put("/api/rating/delete/:rating_id", deleteRating);

//  Starred Routes
app.post("/api/stars", createStar);
app.get("/api/stars", getAllStars);
app.get("/api/stars/:star_id", getStarById);
app.put("/api/stars/:star_id", updateStar);
app.put("/api/stars/delete/:star_id", deleteStar);

// Vote Routes
app.post("/api/votes", createVote);
app.get("/api/votes/answer/:answer_id", getAllVotesForAnswer);
app.get("/api/votes/:vote_id", getVoteById);
app.put("/api/votes/:vote_id", updateVote);
app.put("/api/votes/delete/:vote_id", deleteVote);


// Root route
app.get("/api", (req, res) => {
  res.send("Root is working!");
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).send(`Cannot ${req.method} ${req.originalUrl}`);
});
