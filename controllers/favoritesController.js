const Favorites = require("../models/Favorites");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");
const Course = require("../models/Course");

module.exports = {
  createFavorites: async (req, res) => {
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

      let favorite = await Favorites.findOne({ user: userId });

      if (!favorite) {
        favorite = new Favorites({ user: userId, products: [], courses: [] });
      }

      const product = await Product.findById(id);
      if (product) {
        if (!favorite.products.includes(id)) {
          favorite.products.push(id);
        }
      } else {
        const course = await Course.findById(id);
        if (course) {
          if (!favorite.courses.includes(id)) {
            favorite.courses.push(id);
          }
        }
      }

      await favorite.save();

      res.status(200).json({ message: "Fav created successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create the fav" });
    }
  },

  removeFromFavorites: async (req, res) => {
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

      const favorite = await Favorites.findOne({ user: userId });

      if (!favorite) {
        return res
          .status(404)
          .json({ error: "Favorites not found for the user" });
      }

      const product = await Product.findById(id);
      if (product) {
        favorite.products.remove(id);
      } else {
        const course = await Course.findById(id);
        if (course) {
          favorite.courses.remove(id);
        }
      }

      await favorite.save();

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

      const favorite = await Favorites.findOne({ user: userId });

      if (!favorite) {
        return res.status(200).json({ isFavorite: false });
      }

      if (favorite.products.includes(id) || favorite.courses.includes(id)) {
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

      const favorite = await Favorites.findOne({ user: userId })
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
  personalization: async (req, res) => {
    try {
      const { favorites } = req.body;

      const productTitle = favorites.products.map((item) => item.title);
      const courseNames = favorites.courses.map((item) => item.name);

      let personalizedResults = [];
      if (productTitle.length > 0) {
        const allProductWords = productTitle.join(" ").split(" ");

        const filteredProductWords = allProductWords.filter(
          (word) => word.length > 0
        );

        const coursesMatchingProductWords = await Product.find({
          title: { $regex: filteredProductWords.join("|"), $options: "i" },
        }).limit(5);

        let coursesMatchingCourseWords = [];

        if (courseNames.length > 0) {
          const allCourseWords = courseNames.join(" ").split(" ");

          const filteredCourseWords = allCourseWords.filter(
            (word) => word.length > 0
          );

          coursesMatchingCourseWords = await Course.find({
            name: { $regex: filteredCourseWords.join("|"), $options: "i" },
          }).limit(5);
        }

        personalizedResults = [
          ...coursesMatchingProductWords,
          ...coursesMatchingCourseWords,
        ];

        console.log("personalizedResults");
        console.log(personalizedResults);

        res.json(personalizedResults);
      } else {
        const randomCourses = await Course.aggregate([
          { $sample: { size: 3 } },
        ]);

        const randomProducts = await Product.aggregate([
          { $sample: { size: 2 } },
        ]);
        personalizedResults = [...randomProducts, ...randomCourses];
        res.json(personalizedResults);
      }
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching personalized results.",
      });
    }
  },
};
