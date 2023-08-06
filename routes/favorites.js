const router = require("express").Router();
const favoritesController = require("../controllers/favoritesController");
const token = require("../Middlewares/AuthTokenReq");

router.post("/", token, favoritesController.createFavorites);
router.delete("/remove/:id", token, favoritesController.removeFromFavorites);
router.get("/", token, favoritesController.getAllFavorites);
router.get("/check/:id", token, favoritesController.check);
router.post("/personalization", token, favoritesController.personalization);

module.exports = router;
