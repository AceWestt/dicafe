const mongoose = require("mongoose");

const UserDoodleSchema = new mongoose.Schema({
  img: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const UserDoodle = mongoose.model("Userdoodle", UserDoodleSchema);

module.exports = UserDoodle;
