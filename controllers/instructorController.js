const Instructor = require("../models/Instructor");

module.exports = {
  createInstructor: async (req, res) => {
    const newInstructor = new Instructor(req.body);
    try {
      await newInstructor.save();
      res.status(200).json("Instructor created successfully");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to create the instructor" });
    }
  },

  getInstructor: async (req, res) => {
    try {
      const instructor = await Instructor.findById(req.params.id).populate(
        "courses"
      );
      res.status(200).json(instructor);
    } catch (error) {
      console.log(error);
      res.status(500).json("Failed to get instructor");
    }
  },
};
