const { mongoose } = require("mongoose");
const cart = require("../models/cartSchema.js");

const addToCart = async (req, res) => {
  try {
    const existingCartItem = await cart.findOne({
      courseId: req.params.id,
      userId: req.user.id,
    });

    if (!existingCartItem) {
      await cart.create({
        courseId: req.params.id,
        userId: req.user.id,
        quantity: 1,
      });
      return res
        .status(201)
        .json({ success: true, message: "Course added into the cart!" });
    }

    await cart.findByIdAndUpdate(existingCartItem._id, {
      $inc: { quantity: 1 },
    });

    return res.status(200).json({
      success: true,
      message: "Course quantity incremented in your cart!",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getCartCourses = async (req, res) => {
  try {
    const allAddedCoursesInCart = await cart.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(req.user.id) },
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      { $unwind: "$courseDetails" },
      {
        $addFields: {
          courseTitle: "$courseDetails.title",
          originalAmount: "$courseDetails.originalAmount",
          amount: "$courseDetails.amount",
          courseType: "$courseDetails.courseType",
          image: "$courseDetails.image",
          quantity: "$quantity",
        },
      },
      {
        $project: {
          courseDetails: 0,
        },
      },
    ]);

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
    const cartItem = await cart.findOne({
      courseId: req.params.id,
      userId: req.user.id,
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "This course is not found in your cart!",
      });
    }

    await cart.deleteOne({ _id: cartItem._id });
    return res.status(200).json({
      success: true,
      message: "Course removed from your cart!",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const incrementQuantity = async (req, res) => {
  try {
    console.log(req.params.id);
    const cartItem = await cart.findOne({
      courseId: new mongoose.Types.ObjectId(req.params.id),
      userId: req.user.id,
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "This course is not found in your cart!",
      });
    }

    await cart.findByIdAndUpdate(cartItem._id, { $inc: { quantity: 1 } });

    return res.status(200).json({
      success: true,
      message: "Successfully incremented course quantity in your cart!",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const decrementQuantity = async (req, res) => {
  try {
    const cartItem = await cart.findOne({
      courseId: req.params.id,
      userId: req.user.id,
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "This course is not found in your cart!",
      });
    }

    if (cartItem.quantity > 1) {
      await cart.findByIdAndUpdate(cartItem._id, { $inc: { quantity: -1 } });
      return res.status(200).json({
        success: true,
        message: "Successfully decremented course quantity in your cart!",
      });
    } else {
      await cart.deleteOne({ _id: cartItem._id });
      return res.status(200).json({
        success: true,
        message: "Course removed from your cart!",
      });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCartCourses,
  addToCart,
  deleteCartCourse,
  incrementQuantity,
  decrementQuantity,
};
