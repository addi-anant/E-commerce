const dotenv = require("dotenv");
const multer = require("multer");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();

app.use(express.json()); // JSON Data.
app.set("view engine", "ejs"); // View Engine.
app.use(express.urlencoded({ extended: true })); //Form Data.
app.use(express.static(__dirname + "/public")); // Static File (CSS | JS).
app.use(
  // Session Handling.
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
  })
);

dotenv.config(); // dotenv Configuration.

const upload = multer({ dest: "uploads/" }); // multer Configuration.
app.use(express.static("uploads")); // Static File (Multer).
app.use("/user", express.static("uploads")); // Static File (Multer).
// app.use(upload.single("file")); // multer middleware - single upload.

mongoose // MongoDB Connection:
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Successfully Connection to the MongoDB Database."))
  .catch((error) => console.log(error));

app.use("/", require("./routes/index.js"));

app.listen(8080, () => {
  console.log("server is up and running on port 8080.");
});
