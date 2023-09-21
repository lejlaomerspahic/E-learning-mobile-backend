const stripe = require("stripe")(
  "sk_test_51Nc9U6CNsQ61mmLfaYnK4ms3WZNR0jMZUvzSnqcuXCb6vwYE8hdNMp3BSZQbYfc1G5rgRWvVe77QVaRVEb9BvyUh00P30maJ2g"
);
require("dotenv").config();

module.exports = {
  payment: async (req, res) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.price * 100,
        currency: "usd",
        payment_method_types: ["card"],
      });

      const clientSecret = paymentIntent.client_secret;

      res.status(200).json({ clientSecret });
    } catch (error) {
      console.error("Error creating Payment Intent:", error);
      throw error;
    }
  },
};
