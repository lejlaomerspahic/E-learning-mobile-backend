const Product = require("../models/Product");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
  createProduct: async (req, res) => {
    const newProduct = new Product(req.body);
    console.log("Request:", req.body);
    try {
      await newProduct.save();
      res.status(200).json("Product created successfully");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to create the product" });
    }
  },

  getAllProduct: async (req, res) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.status(200).json(products);
    } catch (error) {
      console.log(error);
      res.status(500).json("Failed to get products");
    }
  },

  getProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      res.status(200).json(product);
    } catch (error) {
      console.log(error);
      res.status(500).json("Failed to get product");
    }
  },

  searchProduct: async (req, res) => {
    try {
      const searchTerm = req.params.key;
      const regex = new RegExp(searchTerm, "i");
      const result = await Product.find({
        $or: [
          { title: regex },
          { supplier: regex },
          { description: regex },
          { imageUrl: regex },
          { product_location: regex },
        ],
      });
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Failed to search product");
    }
  },

  rating: async (req, res) => {
    try {
      const productId = req.params.productId;
      const { rating } = req.body;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Invalid rating" });
      }

      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      req.userData = { userId: decodedToken.userId };
      const userId = req.userData.userId;

      const existingRating = product.ratings.find(
        (user) => user.userId.toString() === userId
      );

      if (existingRating) {
        existingRating.rating = rating;
      } else {
        product.ratings.push({ userId: req.userData.userId, rating });
      }

      await product.save();

      const totalRatings = product.ratings.length;
      const totalRatingSum = product.ratings.reduce(
        (sum, r) => sum + r.rating,
        0
      );
      const averageRating =
        totalRatings > 0 ? totalRatingSum / totalRatings : 0;

      res.json({ message: "Rating added successfully", averageRating });
    } catch (error) {
      console.error("Error adding rating:", error);
      res.status(500).json({ message: "Failed to add rating" });
    }
  },
  checkRating: async (req, res) => {
    try {
      const productId = req.params.productId;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      req.userData = { userId: decodedToken.userId };
      const userId = req.userData.userId;

      const userRating = product.ratings.find(
        (rating) => rating.userId.toString() === userId.toString()
      );

      const totalRatings = product.ratings.length;
      const totalRatingSum = product.ratings.reduce(
        (sum, rating) => sum + rating.rating,
        0
      );
      const averageRating =
        totalRatings > 0 ? totalRatingSum / totalRatings : 0;

      res.json({ product, userRating, totalRatings, averageRating });
    } catch (error) {
      console.error("Error getting product details:", error);
      res.status(500).json({ message: "Failed to get product details" });
    }
  },
};
