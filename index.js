require("dotenv").config();
//Frame Works
const express = require("express");
const mongoose = require("mongoose");

//Database
const database = require("./database/database");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Initialization
const booky = express();

//configuration
booky.use(express.json());

//Establish Database connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("!!! Mongoose Connection Established !!!!!!"));

/*
Route           /
Description     Get all books
Access          PUBLIC
Parameter       NONE  
Methods         GET
*/

booky.get("/", async (req, res) => {
  const getAllBooks = await BookModel.find();
  return res.json({ getAllBooks });
});

/*
Route           /is
Description     Get specific book based on ISBN
Access          PUBLIC
Parameter       isbn
Methods         GET
*/

booky.get("/is/:isbn", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn });
  //Here null=false
  if (!getSpecificBook) {
    return res.json({
      error: `No book found for the ISBN of ${req.params.isbn}`,
    });
  }

  return res.json({ getSpecificBook });
});

/*
Route           /c 
Description     Get specific book based on category
Access          PUBLIC  
Parameter       category      
Methods         GET
*/

booky.get("/c/:category", async (req, res) => {
  const getSpecificBook = await BookModel.find({
    category: req.params.category,
  });

  if (!getSpecificBook) {
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

booky.get("/l/:language", async (req, res) => {
  const getSpecificBook = await BookModel.find({
    language: req.params.language,
  });

  if (!getSpecificBook) {
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

booky.get("/authors", async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json({ authors: getAllAuthors });
});

/*
Route           /authors/id/
Description     to get specific author
Access          PUBLIC  
Parameter       id
Methods         GET
*/

booky.get("/authors/id/:ID", async (req, res) => {
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
Route           /authors/book
Description     to get list of authors based on books
Access          PUBLIC  
Parameter       isbn
Methods         GET
*/

booky.get("/authors/book/:isbn", async (req, res) => {
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
Route           /publications
Description     to all publications
Access          PUBLIC  
Parameter       
Methods         GET
*/

booky.get("/publications", async (req, res) => {
  const getAllPublication = await PublicationModel.find();
  return res.json({ publications: getAllPublication });
});

/*
Route           /publications/id
Description     to all publications
Access          PUBLIC  
Parameter       
Methods         GET
*/

booky.get("/publications/id/:ID", async (req, res) => {
  const getSpecificPublication = await PublicationModel.findOne({
    id: parseInt(req.params.ID),
  });

  if (!getSpecificPublication) {
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

booky.get("/publications/book/:isbn", async (req, res) => {
  const publicationsBasedOnBook = await PublicationModel.find({
    books: req.params.isbn,
  });

  if (!publicationsBasedOnBook) {
    return res.json({
      error: `No Publications found for the book of isbn ${req.params.isbn}`,
    });
  }
  return res.json({ book: publicationsBasedOnBook });
});

//------------------------POST REQUEST THERE AFTER-------------------------

/*
Route           /book/new
Description     add new book
Access          PUBLIC  
Parameter       NONE
Methods         POST
*/

booky.post("/book/new", async (req, res) => {
  const { newBook } = req.body;
  const AddNewBook = await BookModel.create(newBook);

  // database.books.push(newBook);
  return res.json({ books: AddNewBook, message: "book was added!" });
});

/*
Route           /author/new
Description     add new author
Access          PUBLIC  
Parameter       NONE
Methods         POST
*/

booky.post("/author/new", async (req, res) => {
  const { newAuthor } = req.body;
  await AuthorModel.create(newAuthor);
  return res.json({ message: "New author was added!" });
});

/*
Route           /publication/new
Description     add new publication
Access          PUBLIC  
Parameter       NONE
Methods         POST
*/

booky.post("/publication/new", async (req, res) => {
  const { newPublication } = req.body;
  const addNewPublication = await PublicationModel.create(newPublication);
  return res.json({ publication: addNewPublication });
});

//------------------------PUT REQUEST THERE AFTER-------------------------

/*
Route           /book/update/title
Description     update book title
Access          PUBLIC  
Parameter       NONE
Methods         PUT
*/

booky.put("/book/update/title/:isbn", async (req, res) => {
  const updatedBookTitle = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      title: req.body.newBookTitle,
    },
    {
      new: true,
    }
  );
  return res.json({ books: updatedBookTitle });
});

/*
Route           /book/update/author
Description     update/add new author for a book
Access          PUBLIC  
Parameter       NONE
Methods         PUT
*/

booky.put("/book/update/author/:isbn/:authorId", async (req, res) => {
  //update book database

  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $addToSet: {
        authors: parseInt(req.params.authorId),
      },
    },
    {
      new: true,
    }
  );

  //update the author database

  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: parseInt(req.params.authorId),
    },
    {
      $addToSet: {
        books: req.params.isbn,
      },
    },
    {
      new: true,
    }
  );

  return res.json({ books: updatedBook, authors: updatedAuthor });
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
      return book.publications.push(req.body.pubId);
    }
  });
  return res.json({
    message: "successfully updated publication",
    books: database.books,
    publications: database.publications,
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

booky.delete("/book/delete/:isbn", async (req, res) => {
  const updatedBooks = await BookModel.findOneAndDelete();
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
