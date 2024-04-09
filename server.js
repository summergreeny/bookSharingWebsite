if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");

const indexRouter = require("./routes/index");
const authorRouter = require("./routes/authors");
const bookRouter = require("./routes/books");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views"); // The "views" directory, on the other hand, is used to store templates or views that are rendered by Express to generate dynamic HTML pages.
//Views are typically written in template engines like EJS, Pug (formerly Jade), Handlebars, etc. Express processes the template files in the "views" directory, substitutes dynamic data into them as needed, and then sends the resulting HTML to the client.

app.set("layout", "layouts/layout"); //every single file is going to be put inside of this layout file so we dont have to duplicate all the beginning and ending html
app.use(expressLayouts);
app.use(express.static("public")); //The "public" directory is often used to store static assets such as images, stylesheets (CSS), client-side JavaScript files, fonts, and other resources that are served directly to the client (browser)
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

const mongoose = require("mongoose");
const book = require("./models/book");
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

app.use("/", indexRouter); //(route path,route handler)
app.use("/authors", authorRouter);
app.use("/books", bookRouter);
app.listen(process.env.PORT || 3000);
