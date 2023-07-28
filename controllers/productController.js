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

  upload: async (req, res) => {
    try {
      const { imageUrl } = req.body;
      if (!imageUrl) {
        return res.status(400).json({ message: "No image URL provided" });
      }

      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      req.userData = { userId: decodedToken.userId };
      const userId = req.userData.userId;

      await User.findByIdAndUpdate(userId, { imageUrl });

      return res.status(200).json({ message: "Image URL saved successfully" });
    } catch (error) {
      console.error("Error saving image URL:", error.message);
      return res.status(500).json({ message: "Server error" });
    }
  },
};
