const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const favouritesSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
});

const Favourites = mongoose.model("Favourites", favouritesSchema);

module.exports = Favourites;
