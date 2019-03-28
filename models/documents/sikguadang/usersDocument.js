const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: String,
  password: String,
  userName: String,
  phoneNumber: String,
  email: String,
  type: { type: String, default: apiConst.userType.normal },
  status: { type: String, default: apiConst.status.active },
  cdate: { type: Date, default: Date.now },
  ldate: { type: Date, default: Date.now },
  restoreToken: String
});

module.exports = mongoose.model("User", userSchema);
