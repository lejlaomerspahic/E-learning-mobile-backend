const router = require("express").Router();
const quizController = require("../controllers/quizController");
const token = require("../Middlewares/AuthTokenReq");

router.post("/", quizController.createQuiz);
router.get("/search/:key", token, quizController.searchQuiz);

module.exports = router;
