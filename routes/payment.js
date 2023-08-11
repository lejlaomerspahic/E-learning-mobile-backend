const router = require("express").Router();
const payment = require("../controllers/payment");

router.post("/payment", payment.payment);

module.exports = router;
