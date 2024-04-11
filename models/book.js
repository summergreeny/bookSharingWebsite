const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: { type: String },
  publishDate: { type: Date, required: true },
  pageCount: { type: Number, required: true },
  createAt: { type: Date, required: true, default: Date.now },
  coverImage: { type: Buffer, required: true }, //buffer of data representing our entire image
  coverImageType: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
});

//we dont use arrow function here because we need to use this keyword
//This virtual property is used to generate a data URI for displaying the book cover image in HTML.
bookSchema.virtual("coverImagePath").get(function () {
  if (this.coverImage != null && this.coverImageType != null) {
    //Data URI Generation: It constructs the data URI using the format data:[<MIME type>][;charset=<charset>][;base64],<data>,
    // A data URI (Uniform Resource Identifier) is a URI scheme that allows the inclusion of data directly in a web page as if it were an external resource. It provides a way to embed data, such as images, audio, video, or other files, directly into HTML or CSS code, eliminating the need for separate HTTP requests to fetch external resources.
    return `data:${
      this.coverImageType
    };charset=utf-8;base64,${this.coverImage.toString("base64")}`;
  }
});
module.exports = mongoose.model("Book", bookSchema);
