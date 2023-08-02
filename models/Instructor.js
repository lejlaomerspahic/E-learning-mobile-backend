const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const instructorSchema = new Schema({
  name: { type: String, required: true },
  workingMode: { type: String, required: true },
  location: { type: String, required: true },
  hourlyRate: { type: Number, required: true },
  occupation: { type: String },
  subjects: [{ type: String }],
  bio: { type: String },
  contact: {
    email: { type: String },
    phone: { type: String },
    website: { type: String },
  },
  imageUrl: { type: String },
  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
});

const Instructor = mongoose.model("Instructor", instructorSchema);

module.exports = Instructor;
