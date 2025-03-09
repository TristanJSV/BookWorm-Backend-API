const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
  },
  publishedDate: {
    type: Date,
    default: Date.now,
  },
  genre: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
   username: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Book", bookSchema);
