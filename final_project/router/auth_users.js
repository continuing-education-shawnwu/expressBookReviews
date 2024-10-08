const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if user exist
const isValid = (username) => {
  const matched = users.filter((i) => i.username === username);

  if (matched.length === 0) {
    return true;
  }

  return false;
}

// Return matched user
const matchedUser = (username) => {
  const user = users.filter((i) => i.username === username);
  if (user.length === 0) {
    return {}
  }

  return user[0];
};

// User authentication
const authenticatedUser = (username, password) => {
  const matched = matchedUser(username);

  if (matchedUser === {}) {
    return false;
  }

  if (matched.username !== username) {
    return false;
  }

  if (matched.password !== password) {
    return false;
  }

  if (matched.username === username && matched.password === password) {
    return true;
  }
}

// - [x] Task 7: Login as a Registered user - 3 Points
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const userAuthenticated = authenticatedUser(username, password);

  if (!userAuthenticated) {
    return res.status(400).json({
      message: 'Credential Invalid.'
    });
  }

  if (userAuthenticated) {
    const payload = {
      username: username
    };

    const token = jwt.sign(payload, 'SERVER_SECRET', {
      expiresIn: '1h'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3600000,
    })

    return res.status(200).json({
      message: `Customer ${username} successfuly logged in.`,
    });
  }

});


// - [x] Task 8: Add/Modify a book review. - 2 Points
regd_users.put("/auth/review/:isbn", (req, res) => {
  const token = req.headers['authorization'].replace('Bearer ', '');
  const isbn = req.params.isbn;
  const book = books[isbn];
  const userReview = req.body.review;
  const user = {};

  // Verify user token.
  // If verificaiton failed return 403.
  // If verificaiton pass return continute following procedures.
  jwt.verify(token, 'SERVER_SECRET', (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: 'Failed to authenticate.'
      });
    }

    user.username = decoded.username;
  })

  // Check if request body contain review payload.
  if (userReview === undefined) {
    return res.status(400).json({
      message: 'Review cannot be empty.'
    })
  }

  // Check if review from user exist, if exist, update existing review.
  if (book.reviews[user.username] !== undefined) {
    book.reviews[user.username] = userReview;

    return res.status(201).json({
      message: `Review from ${user.username} exsit, updated review with new changes`
    })
  }

  // Add new review from user
  book.reviews[user.username] = userReview;

  return res.status(201).json({
message: `New review from user [${user.username}] for book with ISBN [${isbn}] added/updated.`
  });
});


// - [x] Task 9: Delete book review added by that particular user - 2 Points
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const token = req.headers['authorization'].replace('Bearer ', '');
  const isbn = req.params.isbn;
  const book = books[isbn];
  const user = {};

  // Verify user token.
  // If verificaiton failed return 403.
  // If verificaiton pass, continute following procedures.
  jwt.verify(token, 'SERVER_SECRET', (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: 'Failed to authenticate.'
      });
    }

    user.username = decoded.username;
  })

  // Check if review from user exist
  // If review not exit return 401
  // If review exist, continute following procedures.
  if (!book.reviews[user.username]) {
    return res.status(401).json({
      message: `No review found from user [${user.username}] for title: [${book.title}].`
    })
  }

  // Remove review from user
  delete book.reviews[user.username];

  return res.status(200).json({
    message: `Review from user [${user.username}] for title: [${book.title}] with ISBN [${isbn}] removed successfully.`
  })
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;


