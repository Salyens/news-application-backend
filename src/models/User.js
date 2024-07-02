const mongoose = require("mongoose");

// Define the schema for a user
const UserSchema = new mongoose.Schema(
  {
    // Email field which must be unique, at least 1 character long, and required
    email: { type: String, unique: true, minlength: 1, required: true },
    // Password field which must be at least 1 character long and required
    password: { type: String, minlength: 1, required: true },
  },
  { versionKey: false } // Disable the __v versioning field
);

// Create the User model based on the UserSchema
const User = mongoose.model("User", UserSchema);

// Export the User model and the UserSchema
module.exports = { User, UserSchema };
