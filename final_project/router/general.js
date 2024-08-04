const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books)
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn] === undefined) {
    return res.status(300).json({message: "Book not found."});
  }

  return res.status(200).json(books[isbn]);
});


// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let matched = [];

  for (const key in books) {
    if (books[key].author === author) {
      matched.push(books[key])
    }
  }

  return res.status(200).json({
    booksbyauthor: matched
  });
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let matched = [];

  for (const key in books) {
    if (books[key].title === title) {
      matched.push(books[key])
    }
  }

  return res.status(200).json({
    booksbytitle: matched
  });
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn] === undefined) {
    return res.status(300).json({message: "Book not found."});
  }

  return res.status(200).json(books[isbn].reviews);
});


module.exports.general = public_users;
