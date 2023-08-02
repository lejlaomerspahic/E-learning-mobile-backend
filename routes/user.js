const router = require("express").Router();
const userController = require("../controllers/userController");
const token = require("../Middlewares/AuthTokenReq");

router.put("/update", token, userController.updateUser);
router.post("/update/scores", token, userController.updateScores);
router.post("/upload", token, userController.upload);
router.get("/get", token, userController.getUser);

module.exports = router;
