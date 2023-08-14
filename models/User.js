const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  products: [
    {
      productsId: { type: Schema.Types.ObjectId, ref: "Product" },
      date: { type: Date },
      count: { type: Number },
      price: { type: Number },
    },
  ],
  scores: [
    {
      quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
      score: { type: Number, required: true },
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
