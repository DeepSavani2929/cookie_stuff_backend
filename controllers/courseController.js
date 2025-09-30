const mongoose = require("mongoose");
const courses = require("../models/courseSchema.js");
const cart = require("../models/cartSchema.js");

const addCourses = async (req, res) => {
  try {
    const { title, originalAmount, amount, courseType } = req.body;

    console.log(req.body);
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
    console.error(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const { courseType } = req.query;
    const allCourses = await courses.find({ courseType });

    if (!allCourses || allCourses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found!",
      });
    }

    return res.status(200).json({
      success: true,
      data: allCourses,
      message: "courses are fetched successfully!",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getCourse = async(req,res) => {
     try{
             const perticularCourse = courses.findOne({_id: req.params.id});

             if(!perticularCourse){
               return res.status(400).json({ success: false, message: "This course is not available in courseList!"})
             }

             return res.status(200).json({ success: true, data: perticularCourse, message: "course fetched successfully!"})

     }
     catch(error){
        return res.status(400).json({ success: false, message:  error.message})
     }
}

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
      .json({ success: true, message: "course deleted Successfully!" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const incrementQuantity = async (req, res) => {
  try {
    const isCourseAvailableInCart = await courses.findOne({
      _id: req.params.id,
    });
    if (!isCourseAvailableInCart) {
      return res.status(400).json({
        success: false,
        message: "This course is not available into the cart!",
      });
    }

    await courses.updateOne({ _id: req.params.id }, { $inc: { quantity: 1 } });

    return res.status(200).json({
      success: true,
      message: "Successfully increment the course quantity!",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};


const decrementQuantity = async (req, res) => {
  try {

    const course = await courses.findOne({ _id: req.params.id });

    if (!course) {
      return res.status(400).json({
        success: false,
        message: "This course is not available in the cart!",
      });
    }

    if (course.quantity === 1) {

      await cart.findOneAndDelete({ courseId: req.params.id });

      return res.status(200).json({
        success: true,
        message: "Course removed from cart!",
      });
    } else {
 
      await courses.updateOne(
        { _id: req.params.id },
        { $inc: { quantity: -1 } }
      );

      return res.status(200).json({
        success: true,
        message: "Successfully decremented the course quantity!",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  addCourses,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  incrementQuantity,
  decrementQuantity,
};
