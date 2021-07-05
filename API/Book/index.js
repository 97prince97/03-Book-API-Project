//Initializing Express Router
const Router = require("express").Router();

//Database Models
const BookModel = require("../../database/book");

/*
Route           /
Description     Get all books
Access          PUBLIC
Parameter       NONE  
Methods         GET
*/

Router.get("/", async (req, res) => {
  try {
    const getAllBooks = await BookModel.find();
    return res.json({ getAllBooks });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
Route           /is
Description     Get specific book based on ISBN
Access          PUBLIC
Parameter       isbn
Methods         GET
*/

Router.get("/is/:isbn", async (req, res) => {
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

Router.get("/c/:category", async (req, res) => {
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

Router.get("/l/:language", async (req, res) => {
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
Route           /book/new
Description     add new book
Access          PUBLIC  
Parameter       NONE
Methods         POST
*/

Router.post("/new", async (req, res) => {
  try {
    const { newBook } = req.body;
    const AddNewBook = await BookModel.create(newBook);

    return res.json({ books: AddNewBook, message: "book was added!" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
Route           /book/update/title
Description     update book title
Access          PUBLIC  
Parameter       NONE
Methods         PUT
*/

Router.put("/update/title/:isbn", async (req, res) => {
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

Router.put("/update/author/:isbn/:authorId", async (req, res) => {
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
Route           /book/delete
Description     delete a book 
Access          PUBLIC  
Parameter       isbn
Methods         DELETE
*/

Router.delete("/delete/:isbn", async (req, res) => {
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

Router.delete("/delete/author/:isbn/:authorId", async (req, res) => {
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

module.exports = Router;
