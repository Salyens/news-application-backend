const loginUser = (req, res, next) => {
  const {
    body: { email, password },
  } = req;
  if(!email || !password) return res.status(422).send({ message:"Both password and email are required"});
  return next();
};
module.exports = loginUser;