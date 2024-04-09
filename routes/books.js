const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Book = require("../models/book");
const Author = require("../models/author");
const uploadPath = path.join("public", Book.coverImageBasePath); // concatenate the "public" directory with the coverImageBasePath property from the Book model. The coverImageBasePath property likely specifies a subdirectory within the "public" directory where images will be stored.
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"]; //MIME types represent the type and format of files, and these MIME types specifically represent JPEG, PNG, and GIF image formats.
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    //This line calls the callback function to indicate whether the uploaded file should be accepted or rejected. It checks if the MIME type of the uploaded file (file.mimetype) is included in the imageMimeTypes array. If the MIME type is included, it calls the callback with true to accept the file; otherwise, it calls the callback with false to reject the file.
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

//all book route
router.get("/", async (req, res) => {
  let query = Book.find({});
  if (req.query.title != null && req.query.title !== "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.publishBefore != null && req.query.publishBefore !== "") {
    // less than or equal to
    query = query.lte("publishDate", req.query.publishBefore);
  }
  if (req.query.publishAfter != null && req.query.publishAfter !== "") {
    // less than or equal to
    query = query.gte("publishDate", req.query.publishAfter);
  }
  try {
    const books = await query.exec();
    res.render("books/index", {
      books: books,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

//new book route -> displays the form
router.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

// Create new book route (actually creates the book)
router.post("/", upload.single("cover"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  console.log(req.body);
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate), //convert string to date
    pageCount: req.body.pageCount,
    coverImageName: fileName,
    description: req.body.description,
  });
  console.log(book);

  try {
    const newBook = await book.save();
    res.redirect(`books`);
  } catch (err) {
    console.log(err);
    if (book.coverImageName != null) {
      removeBookCover(book.coverImageName);
    }

    renderNewPage(res, book, true);
  }
});

function removeBookCover(fileName) {
  //fs.unlink method to delete the file from the server's file system.
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.error(err);
  });
}

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const param = {
      authors: authors,
      book: book,
    };
    if (hasError) param.errorMessage = "Error Creating Book";
    res.render("books/new", param);
  } catch {
    res.redirect("/books");
  }
}
module.exports = router;
