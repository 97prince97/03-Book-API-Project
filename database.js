const books = [
  {
    ISBN: "12345Book",
    title: "Getting started with MERN",
    pubDate: "2021-07-07",
    language: ["en", "hindi", "korean"],
    numPage: 250,
    authors: [1, 2],
    publication: [1],
    category: ["tech", "programming", "education", "thriller"],
  },

  {
    ISBN: "12345Book22",
    title: "Getting started with javascript",
    pubDate: "2021-02-02",
    language: ["en", "hindi", "japanese"],
    numPage: 150,
    authors: [2],
    publications: [1],
    category: ["tech", "programming", "education"],
  },
];

const authors = [
  {
    id: 1,
    name: "Pavan",
    books: ["12345Book"],
  },

  { id: 2, name: "Elon Musk", books: ["12345Book", "12345Book22"] },
];

const publications = [
  {
    id: 1,
    name: "writex",
    books: ["12345Book", "12345Book22"],
  },
];
module.exports = { books, authors, publications };
