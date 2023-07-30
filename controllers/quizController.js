const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Quiz = require("../models/Quiz");

module.exports = {
  createQuiz: async (req, res) => {
    const newQuiz = new Quiz(req.body);
    console.log("Request:", req.body);
    try {
      await newQuiz.save();
      res.status(200).json("Quiz created successfully");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to create the quiz" });
    }
  },
  searchQuiz: async (req, res) => {
    try {
      const searchTerm = req.params.key;
      const regex = new RegExp(searchTerm, "i");
      const result = await Quiz.find({
        $or: [{ category: regex }],
      });
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Failed to find quiz");
    }
  },
};
