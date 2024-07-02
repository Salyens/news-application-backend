const router = require("express").Router();
const NewsController = require("../controllers/NewsController");
const verifyToken = require("../middlewares/auth/verifyToken");
const upload = require("../middlewares/upload");

// Route to get all news
router.route("/").get(NewsController.get);

// Route to create news, with token verification and file upload middleware
router.post(
  "/create",
  [verifyToken, upload.array("files", 10)],
  NewsController.create
);

// Routes to delete and update news by ID, with token verification middleware
router
  .route("/:id")
  .delete([verifyToken], NewsController.delete)
  .patch([verifyToken], NewsController.update);

module.exports = router;
