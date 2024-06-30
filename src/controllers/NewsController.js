const { News } = require("../models");
const schedule = require("node-schedule");
const socketManager = require("../utils/socket");


exports.create = async (req, res) => {
  
  try {
    const files = req.files || [];
    const { title, description, quote, code, publishAt } = req.body;
    console.log('publishAt: ', publishAt);
    const publishDate = publishAt ? new Date(publishAt) : null;
    const isPublished = publishDate && publishDate <= new Date();

    const fileNames = files.map(file => file.filename);

    const newPost = await News.create({
      title,
      description,
      quote,
      code,
      isPublished: !!isPublished,
      files: fileNames,
      publishAt: publishDate,
    });

    const io = socketManager.getIO();
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
  } catch (e) {
    console.log('e: ', e);
    return res.status(400).send({ message: "Something is wrong" });
  }
};


exports.delete = async (req, res) => {
  try {
    const { deletedCount } = await News.deleteOne({ _id: req.params.id });
    if (!deletedCount) {
      return res.status(404).send({ message: "Post is not found" });
    }

    const io = socketManager.getIO();
    io.emit("newsDeleted", req.params.id);

    return res.send({ message: "Post successfully deleted" });
  } catch (_) {
    return res.status(400).send({ message: "Something is wrong" });
  }
};

exports.update = async (req, res) => {
  try {
    const postId = req.params.id;

    const updatedPost = await News.findByIdAndUpdate(postId, req.body);

    if (!updatedPost) {
      return res.status(404).send({ message: "Post not found" });
    }

    const io = socketManager.getIO();
    io.emit("newsUpdated", updatedPost);

    return res.send({ message: "Post successfully updated", updatedPost });
  } catch (_) {
    return res.status(400).send({ message: "Something went wrong" });
  }
};

exports.get = async (req, res) => {
  try {
    const news = await News.find({});
    return res.send(news);
  } catch (_) {
    return res.status(400).send({ message: "Something is wrong" });
  }
};
