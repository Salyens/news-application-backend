/**
 * Validates if the given email is in a proper format.
 * 
 * @param {string} email - The email to validate.
 * @returns {boolean} Returns true if the email is valid, false otherwise.
 */
const validEmail = (email) => {
  const regex = new RegExp(/^\w+@\w{2,}\.[a-z]{2,3}$/i);
  return regex.test(email);
};

module.exports = { validEmail };
