const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    originalAmount: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    courseType: {
      type: String,
      enum: ["Features", "Recipes", "Healthy"],
    },

    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const courses = mongoose.model("courses", courseSchema);
module.exports = courses;
