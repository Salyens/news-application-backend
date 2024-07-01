const router = require("express").Router();
const NewsController = require("../controllers/NewsController");
const verifyToken = require("../middlewares/auth/verifyToken");
const upload = require("../middlewares/upload");

router.route("/").get(NewsController.get);
router.post(
  "/create",
  [verifyToken, upload.array("files", 10)],
  NewsController.create
);
router.route("/delete/:id").delete([verifyToken], NewsController.delete);
router.route("/update/:id").patch([verifyToken], NewsController.update);

module.exports = router;
