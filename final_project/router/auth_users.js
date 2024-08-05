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

// only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!authenticatedUser(username, password)) {
    return res.status(400).json({
      message: 'Credential Invalid.'
    });
  }

  if (authenticatedUser(username, password)) {

    // TODO: issue jwt here

    return res.status(200).json({
      message: 'Customer successfuly logged in.'
    });
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: 'Yet to be implemented'});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
