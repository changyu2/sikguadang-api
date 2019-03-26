const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: String,
  password: String,
  userName: String,
  phoneNumber: String,
  email: String
});

module.exports = mongoose.model("User", userSchema);
