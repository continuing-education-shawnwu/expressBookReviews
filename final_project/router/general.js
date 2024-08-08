const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


// Username validation
const usernameValidation = (username) => {
  if (!username) {
    return false;
  }

  if (username === '' || username.trim() === '') {
    return false;
  }

  return true;
};


// Password validation
const passwordValidation = (password) => {
  if (!password) {
    return false;
  }

  if (password === '' || password.trim() === '') {
    return false;
  }

  return true;
};


// - [x] Task 6: Register New user – 3 Points
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!usernameValidation(username)) {
    return res.status(400).json({
      message: 'Invalid username'
    })
  }

  if (!passwordValidation(password)) {
    return res.status(400).json({
      message: 'Invalid password'
    })
  }

  if (!isValid(username)) {
    return res.status(400).json({
      message: 'Username already exist.'
    })
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({
    message: 'Customer successfuly register. Now you can log in.'
  });
});


// - [x] Task 1: Get the book list available in the shop.- 2 Points
public_users.get('/',function (req, res) {
  return res.status(200).json(books)
});


// - [x] Task 2: Get the books based on ISBN.- 2 Points
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let matched = [];

  if (books[isbn] === undefined) {
    return res.status(200).json({
      booksbyisbn: matched
    });
  }

  for (const key in books) {
    if (key.includes(isbn)) {
      books[key].isbn = key
      matched.push(books[key]);
    }
  }

  return res.status(200).json({
    booksbyisbn: matched
  })
});


// - [x] Task 3: Get all books by Author. -2 Points
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


// - [x] Task 4: Get all books based on Title - 2 Points
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


// - [x] Task 5: Get book Review. - 2 Points
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn] === undefined) {
    return res.status(300).json({message: 'Book not found.'});
  }

  return res.status(200).json(books[isbn].reviews);
});


// - [x] Task 10: Get all books – Using async callback function – 2 Points
public_users.get('/books', async function (req, res) {
  try {
    const results = await axios.get('http://localhost:5000/');
    return res.status(200).json(results.data);
  } catch (err) {
    return res.status(400).json({
      message: 'Bad request.'
    })
  }
});

// - [x] Task 11: Search by ISBN – Using Promises – 2 Points
const searchByISBN = (isbn, res) => {
  return  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(res => res.data)
    .catch((err) => {
      throw new Error('Bad request, invalid url');
    })
};

// - [x] Task 12: Search by Author – 2 Points
const searchByAuthor = async (author, res) => {
  return  axios.get(`http://localhost:5000/author/${author}`)
    .then(res => res.data)
    .catch((err) => {
      throw new Error('Bad request, invalid url');
    })
};

// - [x] Task 13: Search by Title - 2 Points
const searchByTitle = async (title, res) => {
  return  axios.get(`http://localhost:5000/title/${title}`)
    .then(res => res.data)
    .catch((err) => {
      throw new Error('Bad request, invalid url');
    })
};

// Book search endpoint
// Based on the query params type to invoke corresponding endpoint.
public_users.get('/search', async function (req, res) {
  const type = req.query;

  switch (true) {
    case (type.isbn !== undefined):
      try {
        const result = await searchByISBN(type.isbn, res);
        return res.status(200).json(result);
      } catch (err) {
        return res.status(400).json({
          message: 'Bad request.'
        });
      }
    case (type.author !== undefined):
      try {
        const result = await searchByAuthor(type.author, res);
        return res.status(200).json(result);
      } catch (err) {
        return res.status(400).json({
          message: 'Bad request.'
        });
      }
    case (type.title !== undefined):
      try {
        const result = await searchByTitle(type.title, res);
        return res.status(200).json(result);
      } catch (err) {
        return res.status(400).json({
          message: 'Bad request.'
        });
      }
    default:
      return res.status(400).json({
        message: 'Bad request.'
      });
  }
});


module.exports.general = public_users;
