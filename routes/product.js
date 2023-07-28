const router = require("express").Router();
const productController = require("../controllers/productController");
const token = require("../Middlewares/AuthTokenReq");

router.get("/", token, productController.getAllProduct);
router.get("/:id", token, productController.getProduct);
router.get("/search/:key", token, productController.searchProduct);
router.post("/", token, productController.createProduct);

router.post("/upload", token, productController.upload);

module.exports = router;
