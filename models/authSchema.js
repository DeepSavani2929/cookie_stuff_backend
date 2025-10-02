const mongoose = require("mongoose");
const authSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    reuired: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
});

const auth = mongoose.model("auth", authSchema);
module.exports = auth;
