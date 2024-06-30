const router = require("express").Router();
const userRouter = require("./UserRouter");
const newsRouter = require("./NewsRouter");

router.use("/user", userRouter);
router.use("/news", newsRouter);

module.exports = router;
