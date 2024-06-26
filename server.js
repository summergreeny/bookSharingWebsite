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
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views"); // The "views" directory, on the other hand, is used to store templates or views that are rendered by Express to generate dynamic HTML pages.
//Views are typically written in template engines like EJS, Pug (formerly Jade), Handlebars, etc. Express processes the template files in the "views" directory, substitutes dynamic data into them as needed, and then sends the resulting HTML to the client.

app.set("layout", "layouts/layout"); //every single file is going to be put inside of this layout file so we dont have to duplicate all the beginning and ending html
app.use(expressLayouts);
app.use(express.static("public")); //The "public" directory is often used to store static assets such as images, stylesheets (CSS), client-side JavaScript files, fonts, and other resources that are served directly to the client (browser)
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(
  "/public/javascript",
  express.static("public/javascript", {
    // Configuring the middleware function that will handle requests for static files.
    // express.static is a built-in middleware function in Express that serves static files,
    // such as HTML, images, CSS, and JavaScript files, from a specified directory.
    type: "application/javascript",
  })
);
//When a form submission is made with a hidden input field named "_method" set to a specific HTTP method (e.g., "PUT" or "DELETE"), the methodOverride middleware intercepts the request.If the "_method" field is found, the middleware overrides the request method with the value specified in the "_method" field.
app.use(methodOverride("_method")); //The method-override middleware allows you to use HTTP verbs such as PUT or DELETE in places where they are not supported.

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
