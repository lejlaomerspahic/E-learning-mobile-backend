const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quizSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  description: { type: String },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctOptionIndex: { type: Number, required: true },
    },
  ],
  totalPoints: { type: Number },
  imageUrl: { type: String },
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
