const router = require("express").Router();
const userController = require("../controllers/userController");
const token = require("../Middlewares/AuthTokenReq");

router.put("/update", token, userController.updateUser);
router.post("/upload", token, userController.upload);
module.exports = router;
