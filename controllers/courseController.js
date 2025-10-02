const courses = require("../models/courseSchema.js");

const addCourses = async (req, res) => {
  try {
    const { title, originalAmount, amount, courseType } = req.body;

    const image = req.file ? req.file.originalname : null;

    if (!title || !originalAmount || !amount || !image) {
      return res.status(400).json({
        success: false,
        message: "All details of the course including image are required!",
      });
    }

    await courses.create({
      title,
      originalAmount,
      amount,
      courseType,
      image,
    });

    return res
      .status(201)
      .json({ success: true, message: "Course created successfully!" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const { courseType } = req.query;
    const allCourses = courseType
      ? await courses.find({ courseType })
      : await courses.find();

    if (!allCourses || allCourses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found!",
      });
    }

    return res.status(200).json({
      success: true,
      data: allCourses,
      message: "Courses fetched successfully!",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getCourse = async (req, res) => {
  try {
    const course = await courses.findOne({ _id: req.params.id });

    if (!course) {
      return res.status(400).json({
        success: false,
        message: "This course is not available in courseList!",
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
      message: "Course fetched successfully!",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const isCourseAvailable = await courses.findById(id);

    if (!isCourseAvailable) {
      return res
        .status(404)
        .json({ success: false, message: "This course is not found!" });
    }

    const { title, originalAmount, amount, courseType } = req.body;

    const updatedCourse = await courses.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          originalAmount,
          amount,
          courseType,
          image: req.file?.filename || isCourseAvailable.image,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course updated successfully!",
      data: updatedCourse,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const isCourseAvailable = await courses.findOne({ _id: req.params.id });

    if (!isCourseAvailable) {
      return res
        .status(200)
        .json({ success: false, message: "This course is not found!" });
    }

    await courses.deleteOne({ _id: isCourseAvailable._id });

    return res
      .status(200)
      .json({ success: true, message: "Course deleted Successfully!" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  addCourses,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
};
