const { validEmail } = require('../../utils/validations');

/**
 * Middleware to validate registration data.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} Response object with status and message if validation fails, otherwise calls next middleware.
 */
const registrationValid = (req, res, next) => {
    const errors = [];
    const { email, password } = req.body;


    // Check if email and password are provided
    if(!email || !password) 
        return res.status(422).send({message: "All fields are required"});

    // Validate email format
    // if(!validEmail(email)) 
    //     errors.push('Invalid email');

    // If there are validation errors, send response with errors
    if(errors.length) 
        return res.status(422).send({message: errors});
    
    // Call the next middleware function
    return next();
};

module.exports = registrationValid;
