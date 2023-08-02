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
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
