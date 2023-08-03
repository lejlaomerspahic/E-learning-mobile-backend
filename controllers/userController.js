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

      const user = await User.findById(userId).populate({
        path: "scores",
        populate: {
          path: "quizId",
        },
      });

      res.status(200).json({ message: "User: ", user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to get user" });
    }
  },
};
