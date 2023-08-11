const stripe = require("stripe")(
  "sk_test_51Nc9U6CNsQ61mmLfaYnK4ms3WZNR0jMZUvzSnqcuXCb6vwYE8hdNMp3BSZQbYfc1G5rgRWvVe77QVaRVEb9BvyUh00P30maJ2g"
);
const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports = {
  payment: async (req, res) => {
    const { token } = req.body;
    try {
      // const paymentMethod = await stripe.paymentMethods.create({
      //   type: "card",
      //   card: req.body.card,
      // });

      console.log("token");
      console.log(token);

      const charge = await stripe.charges.create({
        type: "card",
        amount: 2000,
        currency: "usd",
        source: token.id,
        confirm: true,
      });

      // const paymentIntent = await stripe.paymentIntents.create({
      //   amount: 2000,
      //   currency: "usd",
      //   payment_method: paymentMethod.id,
      //   confirm: true,
      //   source: token.id,
      // });
      res.status(200).json({ message: "Proslo" });
      console.log("charge: ", charge);
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  },
};
