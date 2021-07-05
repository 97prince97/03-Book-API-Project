//Initializing Express Router
const Router = require("express").Router();

//Database Models
const PublicationModel = require("../../database/publication");

/*
Route           /publication
Description     to all publications
Access          PUBLIC  
Parameter       NONE
Methods         GET
*/

Router.get("/", async (req, res) => {
  try {
    const getAllPublication = await PublicationModel.find();
    return res.json({ publications: getAllPublication });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
  Route           /publication/id
  Description     to all publications
  Access          PUBLIC  
  Parameter       
  Methods         GET
  */

Router.get("/id/:ID", async (req, res) => {
  try {
    const getSpecificPublication = await PublicationModel.findOne({
      id: parseInt(req.params.ID),
    });

    if (!getSpecificPublication) {
      return res.json({
        error: `No book found for the author of ${req.params.ID}`,
      });
    }
    return res.json({ publication: getSpecificPublication });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
  Route           /publication/book
  Description     to get list of publications based on books
  Access          PUBLIC  
  Parameter       isbn
  Methods         GET
  */

Router.get("/book/:isbn", async (req, res) => {
  try {
    const publicationsBasedOnBook = await PublicationModel.find({
      books: req.params.isbn,
    });

    if (!publicationsBasedOnBook) {
      return res.json({
        error: `No Publications found for the book of isbn ${req.params.isbn}`,
      });
    }
    return res.json({ book: publicationsBasedOnBook });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
Route           /publication/new
Description     add new publication
Access          PUBLIC  
Parameter       NONE
Methods         POST
*/

Router.post("/new", async (req, res) => {
  try {
    const { newPublication } = req.body;
    const addNewPublication = await PublicationModel.create(newPublication);
    return res.json({ publication: addNewPublication });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
Route           /publication/update/name/
Description     update author name
Access          PUBLIC  
Parameter       NONE
Methods         PUT
*/

Router.put("/update/name/:id", async (req, res) => {
  try {
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
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
  Route           /publication/update/book
  Description     update/add books to publication
  Access          PUBLIC  
  Parameter       isbn
  Methods         PUT
  */

Router.put("/update/book/:isbn", async (req, res) => {
  try {
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
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
Route           /publication/delete
Description     delete a author
Access          PUBLIC  
Parameter       id
Methods         DELETE
*/

Router.delete("/delete/:id", async (req, res) => {
  try {
    const updatedPublicationDatabase = await PublicationModel.findOneAndDelete({
      id: parseInt(req.params.id),
    });
    return res.json({
      publication: updatedPublicationDatabase,
      message: "Publication was deleted!",
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
  Route           /publication/delete/book
  Description     delete a book from a publication
  Access          PUBLIC  
  Parameter       isbn, publicationID
  Methods         DELETE
  */

Router.delete("/delete/book/:isbn/:pubId", async (req, res) => {
  try {
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
  } catch (error) {
    return res.json({ error: error.message });
  }
});

module.exports = Router;
