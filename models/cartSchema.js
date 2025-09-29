const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses",
  },
});

const cart = mongoose.model("coursescart", cartSchema);
module.exports = cart;
