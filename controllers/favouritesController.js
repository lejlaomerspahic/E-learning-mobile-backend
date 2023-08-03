const User = require("../models/User");
const Favourites = require("../models/Favourites");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
  createFavourites: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      req.userData = { userId: decodedToken.userId };
      const userId = req.userData.userId;

      const favourite = new Favourites({ userId, productId, courseId });

      await favourite.save();
      res.status(200).json("Fav created successfully");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to create the fav" });
    }
  },
};
