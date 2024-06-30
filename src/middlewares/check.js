const check = (req, res, next) => {
  console.log("req: ", req.body);

  return next();
};

module.exports = check;
