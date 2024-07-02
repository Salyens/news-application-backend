const router = require("express").Router();
const UserController = require("../../src/controllers/UserController");
const loginUser = require("../middlewares/user/loginUser");
const registrationValid = require("../middlewares/registration/registrationValid");

// Route to handle user login with validation middleware
router.route("/login").post([loginUser], UserController.login);

// Route to handle user registration with validation middleware
router
  .route("/registration")
  .post([registrationValid], UserController.registration);

module.exports = router;
