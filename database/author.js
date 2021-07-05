const mongoose = require("mongoose");

//Author Schema
const AuthorSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
    minLength: 8,
    maxLength: 12,
  },
  name: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 12,
  },
  books: [String],
});

//Creating a book model
const AuthorModel = mongoose.model("authors", AuthorSchema);

module.exports = AuthorModel;
