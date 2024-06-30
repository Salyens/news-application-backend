const validEmail = (email) => {
  const regex = new RegExp(/^\w+@\w{2,}\.[a-z]{2,3}$/i);
  return regex.test(email);
};

module.exports = { validEmail };
