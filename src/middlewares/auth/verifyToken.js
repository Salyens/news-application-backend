const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token in the request headers.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} Response object with status and message if unauthorized, otherwise calls next middleware.
 */
const verifyToken = (req, res, next) => {
  const { headers } = req;

  // Check if authorization header is present
  if (!headers.authorization)
    return res.status(401).send({ message: "Unauthorized" });  

  // Split the authorization header to get the type and token
  const [type, token] = headers.authorization.split(" ");
  
  // Check if the type is Bearer and token is present
  if (type !== "Bearer" || !token)
    return res.status(401).send({ message: "Unauthorized" });

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    // Attach decoded token to the request object
    req["user"] = decoded;
  } catch (_) {
    // If token verification fails, send unauthorized response
    return res.status(401).send({ message: "Unauthorized" });
  }
  
  // Call the next middleware function
  return next();
};

module.exports = verifyToken;
