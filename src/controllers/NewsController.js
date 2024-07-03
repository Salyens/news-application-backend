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
    // Extract files and fields from the request
    const files = req.files || [];
    const { title, description, quote, code, publishAt } = req.body;
    
    // Convert publishAt to a Date object if provided
    const publishDate = publishAt ? new Date(publishAt) : null;
    
    // Determine if the post should be published immediately
    const isPublished = publishDate ? publishDate <= new Date() : false;

    // Extract filenames from the uploaded files
    const fileNames = files.map((file) => file.filename);

    // Create a new post in the database
    const newPost = await News.create({
      title,
      description,
      quote,
      code,
      isPublished: isPublished,
      files: fileNames,
      publishAt: publishDate,
    });

    // Get the socket.io instance
    const io = socketManager.getIO();

    // Schedule the post to be published at the specified date if it's not already published
    if (publishDate && !isPublished) {
      console.log('if');
      schedule.scheduleJob(publishDate, async () => {
        const post = await News.findById(newPost._id);
        if (post && !post.isPublished) {
          post.isPublished = true;
          await post.save();
          io.emit("newsUpdated", post);
        }
      });
    } else {
      // Emit an event to notify clients that a new post has been created
      console.log('else');
      io.emit("newsCreated", newPost);
    }

    // Send the created post as the response
    return res.send(newPost);
  } catch (_) {
    // Handle errors and send a response with a 400 status code
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
    // Find the post by its ID
    const post = await News.findById(req.params.id);
    if (!post) {
      return res.status(404).send({ message: "Post is not found" });
    }

    // Delete the post from the database
    await News.deleteOne({ _id: req.params.id });

    // Get the socket.io instance and emit a deletion event
    const io = socketManager.getIO();
    io.emit("newsDeleted", { id: req.params.id, title: post.title });

    // Send a success message as the response
    return res.send({ message: "Post successfully deleted" });
  } catch (_) {
    // Handle errors and send a response with a 400 status code
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
    // Extract the post ID from the request parameters
    const { id: postId } = req.params;

    // Find and update the post in the database
    const updatedPost = await News.findByIdAndUpdate(postId, req.body);

    if (!updatedPost) {
      return res.status(404).send({ message: "Post not found" });
    }

    // Get the socket.io instance and emit an update event
    const io = socketManager.getIO();
    io.emit("newsUpdated", updatedPost);

    // Send the updated post as the response
    return res.send({ message: "Post successfully updated", updatedPost });
  } catch (_) {
    // Handle errors and send a response with a 400 status code
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
    // Find all news posts in the database
    const news = await News.find({});
    
    // Send the news posts as the response
    return res.send(news);
  } catch (_) {
    // Handle errors and send a response with a 400 status code
    return res.status(400).send({ message: "Something is wrong" });
  }
};
