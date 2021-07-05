//Initializing Express Router
const Router = require("express").Router();

//Database Models
const AuthorModel = require("../../database/author");

/*
Route           /authors
Description     to get all authors
Access          PUBLIC  
Parameter       none
Methods         GET
*/

Router.get("/", async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json({ authors: getAllAuthors });
});

/*
  Route           /author/id/
  Description     to get specific author
  Access          PUBLIC  
  Parameter       id
  Methods         GET
  */

Router.get("/id/:ID", async (req, res) => {
  const getSpecificAuthor = await AuthorModel.findOne({
    id: parseInt(req.params.ID),
  });

  if (!getSpecificAuthor) {
    return res.json({
      error: `No author found for the id of ${parseInt(req.params.ID)}`,
    });
  }
  return res.json({ author: getSpecificAuthor });
});

/*
  Route           /author/book
  Description     to get list of authors based on books
  Access          PUBLIC  
  Parameter       isbn
  Methods         GET
  */

Router.get("/book/:isbn", async (req, res) => {
  const authorList = await AuthorModel.find({
    books: req.params.isbn,
  });

  if (!authorList) {
    return res.json({
      error: `No authors found for the book of isbn ${req.params.isbn}`,
    });
  }
  return res.json({ authors: authorList });
});

/*
Route           /author/new
Description     add new author
Access          PUBLIC  
Parameter       NONE
Methods         POST
*/

Router.post("/new", async (req, res) => {
  const { newAuthor } = req.body;
  await AuthorModel.create(newAuthor);
  return res.json({ message: "New author was added!" });
});

/*
Route           /author/update/name
Description     update author name
Access          PUBLIC  
Parameter       id
Methods         PUT
*/

Router.put("/update/name/:id", async (req, res) => {
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: parseInt(req.params.id),
    },
    {
      name: req.body.newAuthorName,
    },
    {
      new: true,
    }
  );
  return res.json({ authors: updatedAuthor });
});

/*
Route           /author/delete
Description     delete a author
Access          PUBLIC  
Parameter       id
Methods         DELETE
*/

Router.delete("/delete/:id", async (req, res) => {
  const updatedAuthorDatabase = await AuthorModel.findOneAndDelete({
    id: parseInt(req.params.id),
  });
  return res.json({ authors: updatedAuthorDatabase });
});

module.exports = Router;
