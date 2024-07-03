/**
 * Validates if the given email is in a proper format.
 * This function uses a more comprehensive regular expression to cover a wide range of valid email formats.
 * 
 * @param {string} email - The email to validate.
 * @returns {boolean} Returns true if the email is valid, false otherwise.
 */
const validEmail = (email) => {
  const regex = new RegExp(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  );
  return regex.test(email);
};

module.exports = { validEmail };
