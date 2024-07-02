const jwt = require("jsonwebtoken");

/**
 * Generates a JWT token with the provided parameters and expiration time.
 *
 * @param {Object} tokenParams - The payload to include in the token.
 * @param {string|number} expiresIn - The expiration time for the token.
 * @returns {string} The generated JWT token.
 */
const generateToken = (tokenParams, expiresIn) => {
  const token = jwt.sign(tokenParams, process.env.SECRET_KEY, {
    expiresIn,
  });
  return token;
};

module.exports = generateToken;
