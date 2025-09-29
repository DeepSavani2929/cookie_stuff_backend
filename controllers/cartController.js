const cart = require("../models/cartSchema.js");
const courses = require("../models/courseSchema.js");

const addToCart = async (req, res) => {
  try {
    const isCourseAvailableInCart = await cart.findOne({
      courseId: req.params.id,
    });

    if (!isCourseAvailableInCart) {
      await cart.create({ courseId: req.params.id });
      return res
        .status(201)
        .json({ success: true, message: "Course added into the cart!" });
    }

    const perticularCourse = await courses.findOne({ _id: req.params.id });
    if (!perticularCourse) {
      return res
        .status(400)
        .json({ success: false, message: "Course is not found!" });
    }

    await courses.findByIdAndUpdate(
      { _id: req.params.id },
      { $inc: { quantity: 1 } }
    );

    return res.status(200).json({
      success: true,
      message:
        "Course is in the cart and quantity of that course is  Incremented Successfully!",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.messsage });
  }
};

const getCartCourses = async (req, res) => {
  try {


    const allAddedCoursesInCart = await cart.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      {
        $unwind: "$courseDetails",
      },
      {
        $addFields: {
          courseTitle: "$courseDetails.title",
          originalAmount: "$courseDetails.originalAmount",
          amount: "$courseDetails.amount",
          quantity: "$courseDetails.quantity",
          courseType: "$courseDetails.courseType",
          image: "$courseDetails.image",
        },
      },
      {
        $project: {
          courseDetails: 0,
        },
      },
    ]);

    if (!allAddedCoursesInCart || allAddedCoursesInCart.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No courses available in the cart",
      });
    }

    return res.status(200).json({
      success: true,
      data: allAddedCoursesInCart,
      message: "All courses in cart fetched successfully!",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCartCourse = async (req, res) => {
  try {
    const isCourseAvailable = await cart.findOne({ courseId: req.params.id });

    if (!isCourseAvailable) {
      return res.status(404).json({
        success: false,
        message: "This course is not found in the cart!",
      });
    }

    const course = await courses.findOne({ _id: isCourseAvailable.courseId });

    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course not found in the CourseList!",
      });
    }

    await courses.updateOne(
      { _id: isCourseAvailable.courseId },
      { $set: { quantity: 1 } }
    );

    await cart.deleteOne({ _id: isCourseAvailable._id });

    return res.status(200).json({
      success: true,
      message: "Course deleted from cart successfully!",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCartCourses,
  addToCart,
  deleteCartCourse,
};
