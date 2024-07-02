const bcrypt = require("bcrypt");
const { User } = require("../models");
const generateToken = require("../utils/generateToken");

/**
 * Handles user login.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the user by email
    const foundUser = await User.findOne({ email });
    if (!foundUser)
      return res.status(401).send({ message: "Invalid credentials" });

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatch)
      return res.status(401).send({ message: "Invalid credentials" });

    // Generate an access token
    const accessToken = generateToken({ _id: foundUser._id }, "30d");
    
    // Send the access token as the response
    return res.send({ accessToken });
  } catch (_) {
    // Handle errors and send a response with a 400 status code
    return res.status(400).send({ message: "Something is wrong" });
  }
};

/**
 * Handles user registration.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.registration = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Hash the provided password
    const password = bcrypt.hashSync(req.body.password, +process.env.SALT);
    
    // Create a new user in the database
    const newUser = await User.create({ email, password });
    
    // Generate an access token
    const accessToken = generateToken({ _id: newUser._id }, "30d");
    
    // Send the access token as the response
    return res.send({ accessToken });
  } catch (_) {
    // Handle errors and send a response with a 400 status code
    return res.status(400).send({ message: "Something is wrong" });
  }
};
