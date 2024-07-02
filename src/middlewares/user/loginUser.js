/**
 * Middleware to validate login request data.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const loginUser = (req, res, next) => {
  const {
    body: { email, password },
  } = req;

  // Check if both email and password are provided
  if (!email || !password) {
    return res.status(422).send({ message: "Both password and email are required" });
  }

  return next();
};

module.exports = loginUser;
