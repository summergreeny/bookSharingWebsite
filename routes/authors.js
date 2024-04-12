const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");

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
});

router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    console.log(author.id);
    const books = await Book.find({ author: req.params.id }).exec();
    console.log("books", books);
    res.render("authors/show", { author: author, booksByAuthor: books });
  } catch (error) {
    console.error("Error finding books:", error);
    res.redirect("/");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", { author: author });
  } catch {
    res.redirect("/authors");
  }
});

router.put("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (err) {
    if (author == null) {
      res.redirect("/");
    } else {
      res.render("authors/new", {
        author: author,
        errorMessage: "Error Updating Author: ", // Include error message in the response
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.deleteOne();
    res.redirect(`/authors`);
  } catch (err) {
    if (author == null) {
      res.redirect("/");
    } else {
      console.log(err);
      res.redirect(`/authors/${author.id}`);
    }
  }
});

module.exports = router;
