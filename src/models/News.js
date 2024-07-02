const mongoose = require("mongoose");

// Define the schema for a news article
const NewsSchema = new mongoose.Schema(
  {
    // Title field which is required
    title: { type: String, required: true },
    // Description field which is required
    description: { type: String, required: true },
    // Quote field which is optional
    quote: { type: String },
    // Code field which is optional
    code: { type: String },
    // Files field which is an array and optional
    files: { type: Array },
    // Publish date field which is optional
    publishAt: Date,
    // isPublished field which is required and defaults to false
    isPublished: { type: Boolean, required: true, default: false },
  },
  { versionKey: false } // Disable the __v versioning field
);

// Create the News model based on the NewsSchema
const News = mongoose.model("News", NewsSchema);

// Export the News model and the NewsSchema
module.exports = { News, NewsSchema };
