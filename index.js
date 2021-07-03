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
const { parse } = require("dotenv");
const { update } = require("./database/book");

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

booky.put("/author/update/name/:id", async (req, res) => {
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
Route           /publication/update/name/
Description     update author name
Access          PUBLIC  
Parameter       NONE
Methods         PUT
*/

booky.put("/publication/update/name/:id", async (req, res) => {
  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: parseInt(req.params.id),
    },
    {
      name: req.body.newPublicationName,
    },
    {
      new: true,
    }
  );

  return res.json({ Publication: updatedPublication });
});

/*
Route           /publication/update/book
Description     update/add books to publication
Access          PUBLIC  
Parameter       isbn
Methods         PUT
*/

booky.put("/publication/update/book/:isbn", async (req, res) => {
  //update the publication database
  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: req.body.pubId,
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

  //update the book database
  const updatedBookDatabase = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $addToSet: {
        publications: req.body.pubId,
      },
    },
    {
      new: true,
    }
  );
  return res.json({
    message: "successfully updated publication",
    books: updatedBookDatabase,
    publications: updatedPublication,
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
  const updatedBookDatabase = await BookModel.findOneAndDelete({
    ISBN: req.params.isbn,
  });

  return res.json({ books: updatedBookDatabase, message: "book is deleted!" });
});

/*
Route           /book/delete/author
Description     delete a author from a book
Access          PUBLIC  
Parameter       isbn, authorId
Methods         DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", async (req, res) => {
  //update the book database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $pull: {
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
      $pull: {
        books: req.params.isbn,
      },
    },
    {
      new: true,
    }
  );
  return res.json({ book: updatedBook, author: updatedAuthor });
});

/*
Route           /author/delete
Description     delete a author
Access          PUBLIC  
Parameter       id
Methods         DELETE
*/

booky.delete("/author/delete/:id", async (req, res) => {
  const updatedAuthorDatabase = await AuthorModel.findOneAndDelete({
    id: parseInt(req.params.id),
  });
  return res.json({ authors: updatedAuthorDatabase });
});

/*
Route           /publication/delete
Description     delete a author
Access          PUBLIC  
Parameter       id
Methods         DELETE
*/

booky.delete("/publication/delete/:id", async (req, res) => {
  const updatedPublicationDatabase = await PublicationModel.findOneAndDelete({
    id: parseInt(req.params.id),
  });
  return res.json({
    publication: updatedPublicationDatabase,
    message: "Publication was deleted!",
  });
});

/*
Route           /publication/delete/book
Description     delete a book from a publication
Access          PUBLIC  
Parameter       isbn, publicationID
Methods         DELETE
*/

booky.delete("/publication/delete/book/:isbn/:pubId", async (req, res) => {
  //update publication database
  const updatedPublicationDatabase = await PublicationModel.findOneAndUpdate(
    {
      id: parseInt(req.params.pubId),
    },
    {
      $pull: {
        books: req.params.isbn,
      },
    },
    {
      new: true,
    }
  );
  //updating book database
  const updatedBookDatabase = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $pull: {
        publications: parseInt(req.params.pubId),
      },
    },
    {
      new: true,
    }
  );
  return res.json({
    message: "Book was deleted from publication!",
    publication: updatedPublicationDatabase,
    book: updatedBookDatabase,
  });
});

booky.listen(1000, () => console.log("Hey server is running!"));
