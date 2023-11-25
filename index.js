var express = require("express");
var cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTolopology: true,
    });
    console.log("Database connected");
  } catch (error) {
    console.log("Failed to connect to Database", error);
  }
};

connectDB()

var app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
