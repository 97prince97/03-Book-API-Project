const mongoose = require("mongoose");

//creating a book schema
const BookSchema = mongoose.Schema({
  ISBN: String,
  title: String,
  pubDate: String,
  language: [String],
  numOfPage: Number,
  authors: [Number],
  publications: [1],
  category: [String],
});

//Creating a book model
const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;
