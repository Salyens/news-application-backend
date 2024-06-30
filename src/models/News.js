const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    quote: { type: String },
    code: { type: String },
    files:{ type: Array },
    publishAt: Date,
    isPublished: { type: Boolean, required: true, default: false },
  },
  { versionKey: false }
);
const News = mongoose.model("News", NewsSchema);
module.exports = { News, NewsSchema };
