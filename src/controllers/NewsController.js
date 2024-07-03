const { News } = require("../models");
const schedule = require("node-schedule");
const socketManager = require("../utils/socket");

/**
 * Creates a new news post.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.create = async (req, res) => {
  try {
    const files = req.files || [];
    const { title, description, quote, code, publishAt } = req.body;
    const publishDate = publishAt ? new Date(publishAt) : null;
    const isPublished = publishDate ? publishDate <= new Date() : false;
    const fileNames = files.map((file) => file.filename);
    const newPost = await News.create({
      title,
      description,
      quote,
      code,
      isPublished: isPublished,
      files: fileNames,
      publishAt: publishDate,
    });

    const io = socketManager.getIO().of('/news');

    if (publishDate && !isPublished) {
      schedule.scheduleJob(publishDate, async () => {
        const post = await News.findById(newPost._id);
        if (post && !post.isPublished) {
          post.isPublished = true;
          await post.save();
          io.emit("newsUpdated", post);
        }
      });
    } else {
      io.emit("newsCreated", newPost);
    }

    return res.send(newPost);
  } catch (_) {
    return res.status(400).send({ message: "Something is wrong" });
  }
};

/**
 * Deletes a news post.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.delete = async (req, res) => {
  try {
    const post = await News.findById(req.params.id);
    if (!post) {
      return res.status(404).send({ message: "Post is not found" });
    }
    await News.deleteOne({ _id: req.params.id });
    const io = socketManager.getIO().of('/news');
    io.emit("newsDeleted", { id: req.params.id, title: post.title });
    return res.send({ message: "Post successfully deleted" });
  } catch (_) {
    return res.status(400).send({ message: "Something is wrong" });
  }
};

/**
 * Updates a news post.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.update = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const updatedPost = await News.findByIdAndUpdate(postId, req.body);
    if (!updatedPost) {
      return res.status(404).send({ message: "Post not found" });
    }
    const io = socketManager.getIO().of('/news');
    io.emit("newsUpdated", updatedPost);
    return res.send({ message: "Post successfully updated", updatedPost });
  } catch (_) {
    return res.status(400).send({ message: "Something went wrong" });
  }
};

/**
 * Retrieves all news posts.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.get = async (req, res) => {
  try {
    const news = await News.find({});
    return res.send(news);
  } catch (_) {
    return res.status(400).send({ message: "Something is wrong" });
  }
};
