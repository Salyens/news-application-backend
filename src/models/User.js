const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, minlength: 1, required: true },
    password: { type: String, minlength: 1, required: true },
  },
  { versionKey: false }
);
const User = mongoose.model("User", UserSchema);
module.exports = { User, UserSchema };
