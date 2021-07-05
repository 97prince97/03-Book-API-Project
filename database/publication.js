const mongoose = require("mongoose");

//Publication Schema
const PublicationSchema = mongoose.Schema({
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

//Creating a publication model
const PublicationModel = mongoose.model("publications", PublicationSchema);

module.exports = PublicationModel;
