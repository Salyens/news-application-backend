const { validEmail } = require('../../utils/validations');

const registrationValid = (req, res, next) => {
    const errors = [];
    const { email, password } = req.body;
    if(!email || !password) return res.status(422).send({message: "All fields are required"});
    if(!validEmail(email)) errors.push('Invalid email');
    if(errors.length) return res.status(422).send({message: errors});
    return next();
};

module.exports = registrationValid;
