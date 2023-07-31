const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Course = require("../models/Course");

module.exports = {
  createCourse: async (req, res) => {
    const newCourse = new Course(req.body);
    console.log("Request:", req.body);
    try {
      await newCourse.save();
      res.status(200).json("Course created successfully");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to create the course" });
    }
  },

  searchCourse: async (req, res) => {
    try {
      const searchTerm = req.params.key;
      const regex = new RegExp(searchTerm, "i");
      const result = await Course.find({
        $or: [{ category: regex }],
      });
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("Failed to find course");
    }
  },

  getCourse: async (req, res) => {
    try {
      const courseId = req.params.id;
      const course = await Course.findById(courseId).populate("instructors");

      if (!course) {
        return res.status(404).json("Course not found");
      }

      res.status(200).json(course);
    } catch (error) {
      console.log(error);
      res.status(500).json("Failed to get course");
    }
  },
};
