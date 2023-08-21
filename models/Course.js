const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const courseSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  info: { type: String },
  description: { type: String },
  duration: { type: String },
  level: { type: String },
  imageUrl: { type: String },
  videoId: { type: String },
  lastUpdated: { type: String },
  language: { type: String },
  instructors: [{ type: Schema.Types.ObjectId, ref: "Instructor" }],
  ratings: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
    },
  ],
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
