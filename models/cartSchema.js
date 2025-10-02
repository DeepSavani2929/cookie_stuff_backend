const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "auth",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const cart = mongoose.model("coursescart", cartSchema);
module.exports = cart;
