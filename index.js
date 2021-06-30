const express = require("express");

//Database
const database = require("./database");

//Initialization
const booky = express();

//configuration
booky.use(express.json());

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

//------------------------POST REQUEST THERE AFTER-------------------------

/*
Route           /book/new
Description     add new book
Access          PUBLIC  
Parameter       NONE
Methods         POST
*/

booky.post("/book/new", (req, res) => {
  const { newBook } = req.body;

  database.books.push(newBook);
  return res.json({ books: database.books });
});

/*
Route           /author/new
Description     add new author
Access          PUBLIC  
Parameter       NONE
Methods         POST
*/

booky.post("/author/new", (req, res) => {
  const { newAuthor } = req.body;

  database.authors.push(newAuthor);
  return res.json({ authors: database.authors });
});

/*
Route           /publication/new
Description     add new publication
Access          PUBLIC  
Parameter       NONE
Methods         POST
*/

booky.post("/publication/new", (req, res) => {
  const { newPublication } = req.body;

  database.publications.push(newPublication);
  return res.json({ publication: database.publications });
});

//--------------------------PUT REQUEST THERE AFTER---------------------------

/*
Route           /book/update/title
Description     update book title
Access          PUBLIC  
Parameter       NONE
Methods         PUT
*/

booky.put("/book/update/title/:isbn", (req, res) => {
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.title = req.body.newBookTitle;
      return;
    }
  });
  return res.json({ books: database.books });
});

/*
Route           /book/update/author
Description     update/add new author for a book
Access          PUBLIC  
Parameter       NONE
Methods         PUT
*/

booky.put("/book/update/author/:isbn/:authorId", (req, res) => {
  //update book database

  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      return book.authors.push(parseInt(req.params.authorId));
    }
  });

  //update the author database
  database.authors.forEach((author) => {
    if (author.id === parseInt(req.params.authorId))
      return author.books.push(req.params.isbn);
  });
  return res.json({ books: database.books, authors: database.authors });
});

/*
Route           /author/update/name
Description     update author name
Access          PUBLIC  
Parameter       id
Methods         PUT
*/

booky.put("/author/update/name/:id", (req, res) => {
  database.authors.forEach((author) => {
    if (author.id === parseInt(req.params.id)) {
      author.name = req.body.newAuthorName;
      return;
    }
  });
  return res.json({ authors: database.authors });
});

/*
Route           /publication/update/name/
Description     update author name
Access          PUBLIC  
Parameter       NONE
Methods         PUT
*/

booky.put("/publication/update/name/:id", (req, res) => {
  database.publications.forEach((publication) => {
    if (publication.id === parseInt(req.params.id)) {
      publication.name = req.body.newPublicationName;
      return;
    }
  });
  return res.json({ Publication: database.publications });
});

/*
Route           /publication/update/book
Description     update/add books to publication
Access          PUBLIC  
Parameter       isbn, id
Methods         PUT
*/

booky.put("/publication/update/book/:isbn", (req, res) => {
  //update the publication database

  database.publications.forEach((publication) => {
    if (publication.id === req.body.pubId) {
      return publication.books.push(req.params.isbn);
    }
  });

  //update the book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publications = req.body.pubId;
      return;
    }
  });
  return res.json({
    books: database.books,
    publications: database.publications,
    message: "successfully updated publication",
  });
});

booky.listen(1000, () => console.log("Hey server is running!"));
