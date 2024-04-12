const mongoose = require("mongoose");
const Book = require("./book");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

//this function is going to run before the remove event
authorSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log("pre deleteOne");
    try {
      const books = await Book.find({ author: this._id });
      console.log("books", books);
      if (books.length > 0) {
        console.log("books found");
        return next(new Error("This author has books still"));
      }
      next();
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

module.exports = mongoose.model("Author", authorSchema);
