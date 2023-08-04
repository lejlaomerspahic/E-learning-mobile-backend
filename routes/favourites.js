const router = require("express").Router();
const favouritesController = require("../controllers/favouritesController");
const token = require("../Middlewares/AuthTokenReq");

router.post("/", token, favouritesController.createFavourites);
router.delete("/remove/:id", token, favouritesController.removeFromFavourites);

router.get("/check/:id", token, favouritesController.check);

module.exports = router;
