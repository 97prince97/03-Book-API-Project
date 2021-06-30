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
Parameter       isbn
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

//---------------------DELETE REQUEST THERE AFTER-------------------------

/*
Route           /book/delete
Description     delete a book
Access          PUBLIC  
Parameter       isbn
Methods         DELETE
*/

booky.delete("/book/delete/:isbn", (req, res) => {
  const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  );
  database.books = updatedBookDatabase;
  return res.json({ books: database.books });
});

/*
Route           /book/delete/author
Description     delete a author from a book
Access          PUBLIC  
Parameter       isbn, authorId
Methods         DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
  //update the book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      const newAuthorList = book.authors.filter(
        (author) => author !== parseInt(req.params.authorId)
      );
      book.authors = newAuthorList;
      return;
    }
  });

  //update the author database
  database.authors.forEach((author) => {
    if (author.id === parseInt(req.params.authorId)) {
      const newBookList = author.books.filter(
        (book) => book !== req.params.isbn
      );
      author.books = newBookList;
      return;
    }
  });
  return res.json({ book: database.books, author: database.authors });
});

/*
Route           /author/delete
Description     delete a author
Access          PUBLIC  
Parameter       id
Methods         DELETE
*/

booky.delete("/author/delete/:id", (req, res) => {
  const updatedAuthorDatabase = database.authors.filter(
    (author) => author.id !== parseInt(req.params.id)
  );
  database.authors = updatedAuthorDatabase;
  return res.json({ authors: database.authors });
});

/*
Route           /publication/delete
Description     delete a author
Access          PUBLIC  
Parameter       id
Methods         DELETE
*/

booky.delete("/publication/delete/:id", (req, res) => {
  const updatedPublicationDatabase = database.publications.filter(
    (publication) => publication.id !== parseInt(req.params.id)
  );
  database.publications = updatedPublicationDatabase;
  return res.json({ publication: database.publications });
});

/*
Route           /publication/delete/book
Description     delete a book from a publication
Access          PUBLIC  
Parameter       isbn, publicationID
Methods         DELETE
*/

booky.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
  //update publication database
  database.publications.forEach((publication) => {
    if (publication.id === parseInt(req.params.pubId)) {
      const newBookList = publication.books.filter(
        (book) => book !== req.params.isbn
      );
      publication.books = newBookList;
      return;
    }
  });

  //updating book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      const newPublicationList = book.publication.filter(
        (publication) => publication !== parseInt(req.params.pubId)
      );
      book.publication = newPublicationList;
      return;
    }
  });
  return res.json({ publication: database.publications, book: database.books });
});

booky.listen(1000, () => console.log("Hey server is running!"));
