const router = require("express").Router();
const instructorController = require("../controllers/instructorController");
const token = require("../Middlewares/AuthTokenReq");

router.post("/", instructorController.createInstructor);
router.get("/:id", token, instructorController.getInstructor);

module.exports = router;
