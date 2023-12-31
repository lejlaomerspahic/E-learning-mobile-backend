const router = require("express").Router();
const userController = require("../controllers/userController");
const token = require("../Middlewares/AuthTokenReq");

router.put("/update", token, userController.updateUser);
router.put("/update/products", token, userController.updateUserProducts);
router.post("/update/scores", token, userController.updateScores);
router.post("/upload", token, userController.upload);
router.get("/get", token, userController.getUser);
router.get("/statusUpdate", userController.func);
router.get("/get/status/:itemId", userController.getStatus);

module.exports = router;
