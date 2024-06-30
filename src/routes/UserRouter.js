const router = require("express").Router();
const UserController = require("../../src/controllers/UserController");
const loginUser = require("../middlewares/user/loginUser");
const registrationValid = require("../middlewares/registration/registrationValid");

router.route("/login").post([loginUser], UserController.login);
router
  .route("/registration")
  .post([registrationValid], UserController.registration);

module.exports = router;
