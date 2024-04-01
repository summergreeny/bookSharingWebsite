const express = require("express");
const router = express.Router();
const Author = require("../models/author");

//all authors route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    //Regular expressions, often abbreviated as "regex" or "regexp", are sequences of characters that define search patterns. They are used for pattern matching within strings, allowing you to perform operations like search, replace, and validation based on specific patterns
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const authors = await Author.find(searchOptions);
    console.log(authors);
    res.render("authors/index", { authors: authors, searchOptions: req.query });
  } catch (err) {
    res.redirect("/");
  }
});

//new author route -> displays the form
router.get("/new", async (req, res) => {
  // Passing the author object to the view allows you to pre-fill form fields or provide default values when rendering a form for creating a new author.
  res.render("authors/new", { author: new Author() });
});
// Create new author route (actually creates the author)
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await author.save();
    res.redirect("/authors");
  } catch (err) {
    res.render("authors/new", {
      author: author,
      errorMessage: "Error Creating Author: ", // Include error message in the response
    });
  }
  // author
  //   .save()
  //   .then((newAuthor) => {
  //     res.redirect("/authors"); // Redirect to authors page after successful creation
  //   })
  //   .catch((err) => {
  //     res.render("authors/new", {
  //       author: author,
  //       errorMessage: "Error Creating Author: ", // Include error message in the response
  //     });
  //   });
});
module.exports = router;
