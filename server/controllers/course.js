const mongoose = require("mongoose");
const Course = require(".//models/model");
// create new cause
function createCourse(req, res) {
  const course = new Course({
    _id: mongoose.Types.ObjectId(),
    title: req.body.title,
    description: req.body.description,
  });

  return course
    .save()
    .then((newCourse) => {
      return res.status(201).json({
        success: true,
        message: "New cause created successfully",
        Course: newCourse,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
        error: error.message,
      });
    });
}

module.exports = createCourse;
