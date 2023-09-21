const jwt = require("jsonwebtoken");
const Course = require("../models/Course");

module.exports = {
  createCourse: async (req, res) => {
    const newCourse = new Course(req.body);
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

  rating: async (req, res) => {
    try {
      const courseId = req.params.courseId;
      const { rating } = req.body;

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Invalid rating" });
      }

      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      req.userData = { userId: decodedToken.userId };
      const userId = req.userData.userId;

      const existingRating = course.ratings.find(
        (user) => user.userId.toString() === userId
      );

      if (existingRating) {
        existingRating.rating = rating;
      } else {
        course.ratings.push({ userId: req.userData.userId, rating });
      }

      await course.save();

      const totalRatings = course.ratings.length;
      const totalRatingSum = course.ratings.reduce(
        (sum, r) => sum + r.rating,
        0
      );
      const averageRating =
        totalRatings > 0 ? totalRatingSum / totalRatings : 0;

      res.json({ message: "Rating added successfully", averageRating });
    } catch (error) {
      console.error("Error adding rating:", error);
      res.status(500).json({ message: "Failed to add rating" });
    }
  },

  checkRating: async (req, res) => {
    try {
      const courseId = req.params.courseId;

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      req.userData = { userId: decodedToken.userId };
      const userId = req.userData.userId;

      const userRating = course.ratings.find(
        (rating) => rating.userId.toString() === userId.toString()
      );

      const totalRatings = course.ratings.length;
      const totalRatingSum = course.ratings.reduce(
        (sum, rating) => sum + rating.rating,
        0
      );
      const averageRating =
        totalRatings > 0 ? totalRatingSum / totalRatings : 0;

      res.json({ course, userRating, totalRatings, averageRating });
    } catch (error) {
      console.error("Error getting course details:", error);
      res.status(500).json({ message: "Failed to get course details" });
    }
  },
};
