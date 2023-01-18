const { Schema, model } = require("mongoose");
const BlogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    required: true,
  },
  brief: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  tagName: {
    type: String,
    required: true,
  },
});

const Blog = model("Blog", BlogSchema);

module.exports = Blog;
