const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const courseSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  content: [
    {
      title: { type: String, required: true },
      description: { type: String },
      materials: [{ type: String }],
    },
  ],
  duration: { type: String },
  author: { type: String },
  level: { type: String },
  imageUrl: { type: String },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
