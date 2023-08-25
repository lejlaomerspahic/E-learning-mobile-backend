const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
  updateUser: async (req, res) => {
    let { name, email, password, location } = req.body;
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      req.userData = { userId: decodedToken.userId };
      const userId = req.userData.userId;
      const user = await User.findById(userId);
      if (password !== user.password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        password = hashedPassword;
      }

      const updatedUser = await User.findByIdAndUpdate(userId, {
        name,
        email,
        password,
        location,
      });

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res
        .status(200)
        .json({ message: "User data updated successfully", user: updatedUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to update user data" });
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

  updateScores: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      req.userData = { userId: decodedToken.userId };
      const userId = req.userData.userId;
      const { quizId, score } = req.body;

      const user = await User.findById(userId);

      console.log(user);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const quizScoreIndex = user.scores.findIndex(
        (item) => item.quizId.toString() === quizId
      );

      if (quizScoreIndex !== -1) {
        user.scores[quizScoreIndex].score = score;
      } else {
        user.scores.push({ quizId, score });
      }

      const updatedUser = await user.save();

      res
        .status(200)
        .json({ message: "User data updated successfully", user: updatedUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to update user data" });
    }
  },

  getUser: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      req.userData = { userId: decodedToken.userId };
      const userId = req.userData.userId;

      const user = await User.findById(userId)
        .populate({
          path: "scores",
          populate: {
            path: "quizId",
          },
        })
        .populate({
          path: "products.items.productId",
          model: "Product",
        });

      res.status(200).json({ message: "User: ", user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to get user" });
    }
  },

  updateUserProducts: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      const userId = decodedToken.userId;

      const {
        productIds,
        counts,
        price,
        status,
        places,
        date: dateStr,
        priceForDifferentLocation,
      } = req.body;

      console.log("priceForDifferentLocation");
      console.log(priceForDifferentLocation);
      const date = new Date(dateStr);
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let uniqueName = "";
      let areAllNamesEqual = false;

      if (places[0] === places[places.length - 1]) {
        uniqueName = places[0];
        areAllNamesEqual = true;
      }

      if (areAllNamesEqual) {
        const newProducts = productIds.map((productId, index) => ({
          productId,
          count: counts[index],
        }));

        const updatedProducts = {
          items: newProducts,
          date: date.toISOString(),
          status: status,
          price: price,
          place: uniqueName,
        };
        user.products.push(updatedProducts);
      } else {
        const separateProducts = productIds.map((productId, index) => ({
          productId,
          count: counts[index],
        }));

        const separateGroup = separateProducts.map((item, index) => ({
          items: [item],
          date: date.toISOString(),
          status: status,
          price: priceForDifferentLocation[index],
          place: places[index],
        }));

        user.products.push(...separateGroup);
      }

      await user.save();

      return res
        .status(200)
        .json({ message: "User data updated successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Failed to update user data", error });
    }
  },
  updateStatus: async (req, res) => {
    try {
      const currentDate = new Date();
      const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000;
      const newDate = new Date(currentDate.getTime() + twoDaysInMillis);

      const products = await Product.find();

      for (const product of products) {
        const statusOptions = [
          "Poslata",
          "U tranzitu",
          "Stigla u odredište",
          "U procesu dostave",
          "Isporučena",
        ];
        const currentStatusIndex = statusOptions.indexOf(product.status);

        if (currentStatusIndex !== -1) {
          const newStatusIndex =
            (currentStatusIndex + 1) % statusOptions.length;
          product.status = statusOptions[newStatusIndex];
          product.date = newDate;

          await product.save();
        }
      }

      console.log("Statuses updated successfully");
    } catch (error) {
      console.error("Error updating statuses:", error);
    }
  },
};
