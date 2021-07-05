require("dotenv").config();
//Frame Works
const express = require("express");
const mongoose = require("mongoose");

//Database
const database = require("./database");

//Microservices Routes
const Books = require("./API/Book");
const Publications = require("./API/Publication");
const Authors = require("./API/Author");

//Initializing express
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
  .then(() => console.log("!!! DATABASE Connection Established !!!!!!"));

//Initializing Microservices
booky.use("/book", Books);
booky.use("/author", Authors);
booky.use("/publication", Publications);

booky.listen(1000, () => console.log("Hey server is running!"));
