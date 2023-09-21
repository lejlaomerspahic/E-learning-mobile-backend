const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoritesSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
});

const Favorites = mongoose.model("Favorites", favoritesSchema);

module.exports = Favorites;
