const express = require("express");
const router = express.Router();
const { getRandomQuiz } = require("../controllers/quizController");

router.get("/random-quiz", getRandomQuiz);

module.exports = router;
