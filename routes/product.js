const router = require("express").Router();
const productController = require("../controllers/productController");
const token = require("../Middlewares/AuthTokenReq");

router.get("/", token, productController.getAllProduct);
router.get("/:id", token, productController.getProduct);
router.get("/search/:key", token, productController.searchProduct);
router.post("/", productController.createProduct);
router.post("/:productId/rate", token, productController.rating);
router.get("/:productId/rating", token, productController.checkRating);

module.exports = router;
