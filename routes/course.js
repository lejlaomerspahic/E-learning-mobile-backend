const router = require("express").Router();
const courseController = require("../controllers/courseController");

const token = require("../Middlewares/AuthTokenReq");
router.post("/", courseController.createCourse);
router.get("/search/:key", token, courseController.searchCourse);

module.exports = router;
