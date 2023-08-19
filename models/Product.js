const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    supplier: { type: String, required: true },
    price: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    product_location: { type: String, required: true },
    ratings: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
