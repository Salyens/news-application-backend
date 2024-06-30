const bcrypt = require("bcrypt");
const { User } = require("../models");
const generateToken = require("../utils/securiry");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });
    if (!foundUser)
      return res.status(401).send({ message: "Invalid credentials" });

    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatch)
      return res.status(401).send({ message: "Invalid credentials" });

    const accessToken = generateToken({ _id: foundUser._id }, "30d");
    return res.send({ accessToken });
  } catch (_) {
    return res.status(400).send({ message: "Something is wrong" });
  }
};

exports.registration = async (req, res) => {
  try {
    const password = bcrypt.hashSync(req.body.password, +process.env.SALT);
    const newUser = await User.create({ ...req.body, password });

    const accessToken = generateToken({ _id: newUser._id }, "30d");
    return res.send({ accessToken });
  } catch (_) {
    return res.status(400).send({ message: "Something is wrong" });
  }
};
