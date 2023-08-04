const Favourites = require("../models/Favourites");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");
const Course = require("../models/Course");

module.exports = {
  createFavourites: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      req.userData = { userId: decodedToken.userId };
      const userId = req.userData.userId;

      const { id } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ error: "Missing id in the request body" });
      }

      let favourite = await Favourites.findOne({ user: userId });

      if (!favourite) {
        favourite = new Favourites({ user: userId, products: [], courses: [] });
      }

      const product = await Product.findById(id);
      if (product) {
        if (!favourite.products.includes(id)) {
          favourite.products.push(id);
        }
      } else {
        const course = await Course.findById(id);
        if (course) {
          if (!favourite.courses.includes(id)) {
            favourite.courses.push(id);
          }
        }
      }

      await favourite.save();

      res.status(200).json({ message: "Fav created successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create the fav" });
    }
  },

  removeFromFavourites: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      req.userData = { userId: decodedToken.userId };
      const userId = req.userData.userId;

      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ error: "Missing id in the request body" });
      }

      const favourite = await Favourites.findOne({ user: userId });

      if (!favourite) {
        return res
          .status(404)
          .json({ error: "Favourites not found for the user" });
      }

      const product = await Product.findById(id);
      if (product) {
        favourite.products.remove(id);
      } else {
        const course = await Course.findById(id);
        if (course) {
          favourite.courses.remove(id);
        }
      }

      await favourite.save();

      res.status(200).json({ message: "Fav removed successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to remove the fav" });
    }
  },
  check: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      req.userData = { userId: decodedToken.userId };
      const userId = req.userData.userId;

      const { id } = req.params;

      const favourite = await Favourites.findOne({ user: userId });

      if (!favourite) {
        return res.status(200).json({ isFavorite: false });
      }

      if (favourite.products.includes(id) || favourite.courses.includes(id)) {
        return res.status(200).json({ isFavorite: true });
      } else {
        return res.status(200).json({ isFavorite: false });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to check favorite" });
    }
  },

  getAllFavorites: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      req.userData = { userId: decodedToken.userId };
      const userId = req.userData.userId;

      const favorite = await Favourites.findOne({ user: userId })
        .populate({
          path: "courses",
          populate: {
            path: "instructors",
          },
        })
        .populate("products");

      if (!favorite) {
        return res
          .status(404)
          .json({ error: "Favorites not found for this user" });
      }

      return res.status(200).json(favorite);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to get favorites" });
    }
  },
};
