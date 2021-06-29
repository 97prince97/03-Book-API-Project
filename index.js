const express = require("express");

//Database
const database = require("./database");

//Initialization
const booky = express();

/*
Route           /
Description     Get all books
Access          PUBLIC
Parameter       NONE  
Methods         GET
*/

booky.get("/", (req, res) => {
  return res.json({ books: database.books });
});

/*
Route           /is
Description     Get specific book based on ISBN
Access          PUBLIC
Parameter       isbn
Methods         GET
*/

booky.get("/is/:isbn", (req, res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );

  if (getSpecificBook.length === 0) {
    return res.json({
      error: `No book found for the ISBN of ${req.params.isbn}`,
    });
  }

  return res.json({ book: getSpecificBook });
});

/*
Route           /c 
Description     Get specific book based on category
Access          PUBLIC  
Parameter       category      
Methods         GET
*/

booky.get("/c/:category", (req, res) => {
  const getSpecificBook = database.books.filter((book) =>
    book.category.includes(req.params.category)
  );
  if (getSpecificBook.length === 0) {
    return res.json({
      error: `No book found for the category of ${req.params.category}`,
    });
  }
  return res.json({ book: getSpecificBook });
});

/*
Route           /l
Description     Get specific book based on category
Access          PUBLIC  
Parameter       language  
Methods         GET
*/

booky.get("/l/:language", (req, res) => {
  const getSpecificBook = database.books.filter((book) =>
    book.language.includes(req.params.language)
  );
  if (getSpecificBook.length === 0) {
    return res.json({
      error: `No book found for the language of ${req.params.language}`,
    });
  }
  return res.json({ book: getSpecificBook });
});

/*
Route           /authors
Description     to get all authors
Access          PUBLIC  
Parameter       none
Methods         GET
*/

booky.get("/authors", (req, res) => {
  return res.json({ authors: database.authors });
});

/*
Route           /authors/id/
Description     to get specific author
Access          PUBLIC  
Parameter       id
Methods         GET
*/

booky.get("/authors/id/:ID", (req, res) => {
  const getSpecificAuthor = database.authors.filter(
    (author) => author.id === parseInt(req.params.ID)
  );
  if (getSpecificAuthor.length === 0) {
    return res.json({
      error: `No book found for the author of ${req.params.isbn}`,
    });
  }
  return res.json({ author: getSpecificAuthor });
});

/*
Route           /authors/book
Description     to get list of authors based on books
Access          PUBLIC  
Parameter       isbn
Methods         GET
*/

booky.get("/authors/book/:isbn", (req, res) => {
  const authorList = database.authors.filter((author) =>
    author.books.includes(req.params.isbn)
  );
  if (authorList.length === 0) {
    return res.json({
      error: `No authors found for the book of isbn ${req.params.isbn}`,
    });
  }
  return res.json({ book: authorList });
});

/*
Route           /publications
Description     to all publications
Access          PUBLIC  
Parameter       
Methods         GET
*/

booky.get("/publications", (req, res) => {
  return res.json({ publications: database.publications });
});

/*
Route           /publications/id
Description     to all publications
Access          PUBLIC  
Parameter       
Methods         GET
*/

booky.get("/publications/id/:ID", (req, res) => {
  const getSpecificPublication = database.publications.filter(
    (publication) => publication.id === parseInt(req.params.ID)
  );
  if (getSpecificPublication.length === 0) {
    return res.json({
      error: `No book found for the author of ${req.params.ID}`,
    });
  }
  return res.json({ publication: getSpecificPublication });
});

/*
Route           /publication/book
Description     to get list of authors based on books
Access          PUBLIC  
Parameter       isbn
Methods         GET
*/

booky.get("/publications/book/:isbn", (req, res) => {
  const publicationList = database.publications.filter((publication) =>
    publication.books.includes(req.params.isbn)
  );
  if (publicationList.length === 0) {
    return res.json({
      error: `No Publications found for the book of isbn ${req.params.isbn}`,
    });
  }
  return res.json({ book: publicationList });
});

booky.listen(1000, () => console.log("Hey server is running!"));
